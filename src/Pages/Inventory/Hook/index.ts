import { useContext } from 'react'
import { InventoryContext } from '../InventoryContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createInventoryItem,
    getAllInventoryItems,
    getOneInventoryItem,
} from './queries'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { useForm } from '@tanstack/react-form'
import { AxiosError } from 'axios'
import {
    fetchAllPaginatedData,
    matchesSearchText,
    normalizeFilterText,
    paginateClientRows,
} from '@/Helpers/clientTableFiltering'
import { InventoryItem } from '../types'

export const useAllInventoryItems = () => {
    const { searchParams } = useContext(InventoryContext)
    const page = searchParams.get('page') || '0'
    const limit = searchParams.get('limit') || '5'
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''

    return useQuery({
        queryKey: ['allInventoryItems', page, limit, search, status, type],
        queryFn: async () => {
            const shouldFilterClientSide =
                search.trim() !== '' || status !== '' || type !== ''

            if (!shouldFilterClientSide) {
                return getAllInventoryItems(page, limit)
            }

            const allItems = await fetchAllPaginatedData<InventoryItem>(
                (pageToFetch, limitToFetch) =>
                    getAllInventoryItems(
                        String(pageToFetch),
                        String(limitToFetch),
                        search,
                        status,
                        type,
                    ),
            )
            const filteredItems = allItems.filter((item) => {
                const occupant = item.userId
                    ? `${item.userId.firstName} ${item.userId.lastName}`
                    : ''
                const matchesStatus =
                    !status ||
                    normalizeFilterText(item.status) ===
                        normalizeFilterText(status)
                const matchesType =
                    !type ||
                    normalizeFilterText(item.type) === normalizeFilterText(type)

                return (
                    matchesStatus &&
                    matchesType &&
                    matchesSearchText(search, [
                        item.type,
                        item.status,
                        item.serialNumber,
                        occupant,
                        item.userId?.firstName,
                        item.userId?.lastName,
                    ])
                )
            })

            return paginateClientRows(
                filteredItems,
                Number(page) || 0,
                Number(limit) || 5,
            )
        },
    })
}

export const useGetOneInventoryItem = () => {
    const { searchParams } = useContext(InventoryContext)
    return useQuery({
        queryKey: [
            'oneInventoryItem',
            searchParams.get('selectedInventoryItem'),
        ],
        queryFn: () =>
            getOneInventoryItem(
                searchParams.get('selectedInventoryItem') as string,
            ),
    })
}

export const useCreateInventoryItem = () => {
    const { handleCloseCreateModalOpen } = useContext(InventoryContext)

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            type,
            serialNumber,
        }: {
            type: 'laptop' | 'monitor'
            serialNumber: string
        }) => createInventoryItem(type, serialNumber),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['allInventoryItems'],
            })
            handleCloseCreateModalOpen()
        },
    })
}

export const useCreateItemForm = () => {
    const { setError } = useContext(InventoryContext)
    const { mutate } = useCreateInventoryItem()

    const form = useForm({
        defaultValues: {
            type: 'laptop',
            serialNumber: '',
        },
        onSubmit: async ({ value }) => {
            mutate(
                {
                    type: value.type as 'laptop' | 'monitor',
                    serialNumber: value.serialNumber,
                },
                {
                    onError: (error) => {
                        if (error instanceof AxiosError) {
                            if (error?.response?.data?.message) {
                                setError(error?.response?.data?.message)
                                return
                            }
                            if (error.code === 'ERR_NETWORK') {
                                setError(
                                    'No internet connection. Please try again later.',
                                )
                                return
                            }
                        }
                        setError('An error occurred. Please try again later.')
                    },
                },
            )
        },
        validatorAdapter: valibotValidator(),
    })

    return { form }
}
