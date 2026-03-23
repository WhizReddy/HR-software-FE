import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryResult,
} from '@tanstack/react-query'
import {
    createVacation,
    getAllVacations,
    getUsersWithVacations,
    getUserWithVacations,
    getVacation,
    updateVacation,
} from './queries'
import { useContext } from 'react'
import { VacationContext } from '../VacationContext'
import { VacationFormFields } from '@/Schemas/Vacations/Vacation.schema'
import { CreateVacationFormFields } from '@/Schemas/Vacations/CreateVacation.schema'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { useParams } from 'react-router-dom'
import { getVacationErrorMessage } from '../errorMessage'

export const useGetVacations = (page: number, limit: number, search = '') => {
    return useQuery({
        queryKey: ['vacations', page, limit, search],
        queryFn: () =>
            getAllVacations(String(page), String(limit), search.trim()),
        placeholderData: (previousData) => previousData,
    })
}

export const useGetVacation = () => {
    const { searchParams } = useContext(VacationContext)
    const selectedVacation = searchParams.get('selectedVacation')
    return useQuery({
        queryKey: ['vacation', selectedVacation],
        queryFn: () => getVacation(selectedVacation!),
        enabled: Boolean(selectedVacation),
    })
}

export const useGetUsersWithVacations = () => {
    const { searchParams } = useContext(VacationContext)

    return useInfiniteQuery({
        initialPageParam: 0,
        queryKey: [
            'usersWithVacations',
            searchParams.get('search'),
            searchParams.get('users'),
        ],
        queryFn: ({ pageParam }) =>
            getUsersWithVacations({
                pageParam,
                search: (searchParams.get('search') as string) || '',
                users: (searchParams.get('users') as string) || '',
            }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.totalPages > allPages.length
                ? allPages.length
                : undefined
        },
    })
}
export const useGetUserWithVacations = () => {
    const { searchParams } = useContext(VacationContext)
    const { id } = useParams<{ id: string }>()
    const userId = id || searchParams.get('userId')

    return useQuery({
        queryKey: ['userWithVacations', userId],
        queryFn: () => getUserWithVacations(userId!),
        enabled: Boolean(userId),
    })
}

export const useUpdateVacation = () => {
    const { searchParams } = useContext(VacationContext)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ vacation }: { vacation: VacationFormFields }) =>
            updateVacation(
                searchParams.get('selectedVacation') as string,
                vacation,
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['vacations'],
            })
            queryClient.invalidateQueries({
                queryKey: ['vacation'],
            })
            queryClient.invalidateQueries({
                queryKey: [searchParams.get('selectedVacation') as string],
            })
        },
    })
}
export const useCreateVacation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ vacation }: { vacation: CreateVacationFormFields }) =>
            createVacation(vacation),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['vacations'],
            })
        },
    })
}

export const useUpdateVacationForm = (vacation: UseQueryResult<any, Error>) => {
    const { setErrors, setToastConfigs, handleCloseVacationModalOpen } =
        useContext(VacationContext)
    const updater = useUpdateVacation()

    const form = useForm({
        defaultValues: {
            status: vacation.data.status,
            type: vacation.data.type,
            startDate: dayjs(vacation.data.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(vacation.data.endDate).format('YYYY-MM-DD'),
        },
        validatorAdapter: valibotValidator(),
        onSubmit: async ({ value }) => {
            setErrors({
                createError: null,
                updateError: null,
            })

            const payload = {
                ...value,
                endDate: dayjs(value.endDate).toISOString(),
                startDate: dayjs(value.startDate).toISOString(),
            }
            // Use mutation callbacks — checking isError synchronously after mutate() is
            // always false because mutate() is fire-and-forget (async race condition).
            updater.mutate(
                { vacation: payload },
                {
                    onSuccess: () => {
                        setErrors({
                            createError: null,
                            updateError: null,
                        })
                        setToastConfigs({
                            isOpen: true,
                            message: 'Vacation updated successfully',
                            severity: 'success',
                        })
                        handleCloseVacationModalOpen()
                    },
                    onError: (error) => {
                        const message = getVacationErrorMessage(
                            error,
                            'Failed to update vacation',
                        )

                        setToastConfigs({
                            isOpen: true,
                            message,
                            severity: 'error',
                        })
                        setErrors({
                            createError: null,
                            updateError: message,
                        })
                    },
                },
            )
        },
    })
    return { form }
}

export const useCreateVacationForm = () => {
    const { createVacationToggler, setErrors, setToastConfigs } =
        useContext(VacationContext)

    const { mutate } = useCreateVacation()

    const form = useForm<{
        description: string
        type: 'vacation' | 'sick' | 'personal' | 'maternity'
        startDate: string
        endDate: string
    }>({
        defaultValues: {
            description: '',
            type: 'vacation',
            startDate: dayjs(new Date()).format('YYYY-MM-DD'),
            endDate: dayjs(new Date()).add(2, 'day').format('YYYY-MM-DD'),
        },
        onSubmit: async ({ value }) => {
            setErrors({
                createError: null,
                updateError: null,
            })

            const payload = {
                ...value,
                endDate: dayjs(value.endDate).toISOString(),
                startDate: dayjs(value.startDate).toISOString(),
            }
            // Use mutation callbacks — checking isError synchronously after mutate() is
            // always false because mutate() is fire-and-forget (async race condition).
            mutate(
                { vacation: payload },
                {
                    onSuccess: () => {
                        setErrors({
                            createError: null,
                            updateError: null,
                        })
                        setToastConfigs({
                            isOpen: true,
                            message: 'Vacation created successfully',
                            severity: 'success',
                        })
                        createVacationToggler()
                    },
                    onError: (error) => {
                        const message = getVacationErrorMessage(
                            error,
                            'Failed to create vacation',
                        )

                        setToastConfigs({
                            isOpen: true,
                            message,
                            severity: 'error',
                        })
                        setErrors({
                            createError: message,
                            updateError: null,
                        })
                    },
                },
            )
        },
    })

    return { form }
}
