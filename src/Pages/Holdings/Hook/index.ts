import { useContext } from 'react'
import { HoldingsContext } from '../HoldingsContext'
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import {
    getHoldings,
    getItem,
    getUserHoldings,
    handleItemAssign,
    handleItemReturn,
} from './queries'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'

export const useEmployeesWithHoldings = () => {
    const { searchParams } = useContext(HoldingsContext)

    return useInfiniteQuery({
        initialPageParam: 0,
        queryKey: [
            'usersWithHoldings',
            searchParams.get('users'),
            searchParams.get('search'),
        ],
        queryFn: ({ pageParam }) =>
            getHoldings({
                pageParam,
                search: searchParams.get('search') || '',
                users: searchParams.get('users') || '',
            }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length
                ? allPages.length
                : undefined
        },
    })
}

export const useGetUserHoldings = () => {
    const { searchParams } = useContext(HoldingsContext)

    return useQuery({
        queryKey: ['userHoldings', searchParams.get('selectedUser')],
        queryFn: () =>
            getUserHoldings(searchParams.get('selectedUser') as string),
    })
}

export const useGetItem = () => {
    const { searchParams } = useContext(HoldingsContext)

    return useQuery({
        queryKey: ['userHoldingsItem', searchParams.get('ownedItem')],
        queryFn: () => getItem(searchParams.get('ownedItem') as string),
    })
}

export const useHandleItemAssigner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            assetId,
            userId,
            date,
        }: {
            assetId: string
            userId: string
            date: string
        }) => handleItemAssign(assetId, userId, date),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['usersWithHoldings'],
            })
            queryClient.invalidateQueries({
                queryKey: ['userHoldings'],
            })
        },
    })
}

export const useHandleItemReturner = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            assetId,
            status,
            returnDate,
        }: {
            assetId: string
            status: string
            returnDate: string
        }) => handleItemReturn(assetId, status, returnDate),
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ['usersWithHoldings'],
            })
            queryClient.invalidateQueries({
                queryKey: ['userHoldings'],
            })
        },
    })
}

export const useAssignAssetForm = () => {
    const { mutateAsync } = useHandleItemAssigner()
    const {
        searchParams,
        handleCloseOnModal: handleClose,
        setToastConfigs,
    } = useContext(HoldingsContext)

    const form = useForm({
        defaultValues: {
            assetId: '',
            date: new Date().toISOString().split('T')[0],
        },
        onSubmit: async ({ value }) => {
            try {
                await mutateAsync({
                    assetId: value.assetId as string,
                    userId: searchParams.get('selectedUser') as string,
                    date: value.date,
                })
                setToastConfigs({
                    isOpen: true,
                    message: 'Item assigned successfully',
                    severity: 'success',
                })
                handleClose()
            } catch {
                setToastConfigs({
                    isOpen: true,
                    message: 'Error assigning item',
                    severity: 'error',
                })
            }
        },
        validatorAdapter: valibotValidator(),
    })
    return { form }
}

export const useReturnAssetForm = () => {
    const { handleCloseOnModal: handleClose, setToastConfigs } =
        useContext(HoldingsContext)
    const itemGetter = useGetItem()

    const { mutateAsync } = useHandleItemReturner()

    const form = useForm({
        defaultValues: {
            status: 'available',
            returnDate: new Date().toISOString().split('T')[0],
        },

        onSubmit: async ({ value }) => {
            try {
                if (!itemGetter.data?._id) throw new Error('Asset data not loaded')
                await mutateAsync({
                    assetId: itemGetter.data._id,
                    status: value.status,
                    returnDate: value.returnDate,
                })
                setToastConfigs({
                    isOpen: true,
                    message: 'Item returned successfully',
                    severity: 'success',
                })
                handleClose()
            } catch {
                setToastConfigs({
                    isOpen: true,
                    message: 'Error returning item',
                    severity: 'error',
                })
            }
        },
        validatorAdapter: valibotValidator(),
    })

    return { form, itemGetter }
}
