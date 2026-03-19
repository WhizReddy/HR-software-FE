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
import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'

export const useGetVacations = () => {
    const { searchParams } = useContext(VacationContext)

    return useQuery({
        queryKey: [
            'vacations',
            searchParams.get('page'),
            searchParams.get('limit'),
            searchParams.get('search'),
        ],
        queryFn: () =>
            getAllVacations(
                searchParams.get('page') as string,
                searchParams.get('limit') as string,
                searchParams.get('search') || '',
            ),
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
                        setToastConfigs({
                            isOpen: true,
                            message: 'Vacation updated successfully',
                            severity: 'success',
                        })
                        handleCloseVacationModalOpen()
                    },
                    onError: (error) => {
                        setToastConfigs({
                            isOpen: true,
                            message: error?.message || 'Failed to update vacation',
                            severity: 'error',
                        })
                        if (error instanceof AxiosError)
                            setErrors({
                                createError: null,
                                updateError: error.response?.data?.message || 'Conflict occurred updating vacation',
                            })
                        else {
                            setErrors({
                                createError: null,
                                updateError: 'something happened',
                            })
                        }
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
                        setToastConfigs({
                            isOpen: true,
                            message: 'Vacation created successfully',
                            severity: 'success',
                        })
                        createVacationToggler()
                    },
                    onError: (error) => {
                        setToastConfigs({
                            isOpen: true,
                            message: error?.message || 'Failed to create vacation',
                            severity: 'error',
                        })
                        if (error instanceof AxiosError) {
                            const data = (error as AxiosError).response?.data as any
                            const msg =
                                typeof data?.message === 'string'
                                    ? data.message
                                    : Array.isArray(data?.message)
                                      ? data.message.join(', ')
                                      : typeof data === 'string'
                                        ? data
                                        : 'Failed to create vacation'
                            setErrors({
                                createError: msg,
                                updateError: null,
                            })
                        } else {
                            setErrors({
                                createError: 'Something went wrong, please try again',
                                updateError: null,
                            })
                        }
                    },
                },
            )
        },
    })

    return { form }
}
