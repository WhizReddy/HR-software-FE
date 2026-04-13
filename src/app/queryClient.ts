import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const shouldRetryQuery = (failureCount: number, error: unknown) => {
    if (error instanceof AxiosError) {
        const status = error.response?.status
        if (status && status < 500) {
            return false
        }
    }

    return failureCount < 2
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
            retry: shouldRetryQuery,
        },
    },
})
