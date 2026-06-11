import { useMutation } from '@tanstack/react-query'

import AxiosInstance from '@/Helpers/Axios'

export interface applicantsData {
    customMessage: string
    customSubject: string
    forEach(arg0: (applicant: applicantsData) => void): unknown
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    positionApplied: string
    status: string
    _id: string
    firstInterviewDate?: string
    secondInterviewDate?: string
    notes: string
    message: string
    currentPhase: string
    isDeleted?: boolean
}
import { useQuery } from '@tanstack/react-query'

export const useGetAllInterviews = () => {
    const fetchApplicants = async () => {
        const response = await AxiosInstance.get('/applicant')
        return Array.isArray(response.data)
            ? response.data
            : (response.data?.data ?? [])
    }

    const { data, error, isLoading } = useQuery({
        queryKey: ['interviews'],
        queryFn: fetchApplicants,
    })

    return { data, error, loading: isLoading }
}

export const useHandleReject = () => {
    const mutation = useMutation({
        mutationFn: async (interviewId: string) => {
            const response = await AxiosInstance.patch(
                `/applicant/${interviewId}`,
                {
                    status: 'rejected',
                },
            )
            return response.data
        },
        onError: (error) => {
            console.error('Failed to reject interview:', error)
        },
    })

    return {
        handleReject: mutation.mutate,
        loading: mutation.isPending,
        error: mutation.error,
    }
}
