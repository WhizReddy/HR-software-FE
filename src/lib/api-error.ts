import { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api'

export const REQUEST_TIMEOUT_MS = 60_000

export const getApiErrorMessage = (
    error: unknown,
    fallback = 'An error occurred. Please try again later.',
) => {
    if (error instanceof AxiosError) {
        const axiosErr = error as AxiosError<ApiErrorResponse>
        const message = axiosErr.response?.data?.message

        if (message) {
            return Array.isArray(message) ? message[0] : message
        }

        if (axiosErr.code === 'ECONNABORTED') {
            return 'The server took too long to respond. Please try again.'
        }

        if (axiosErr.code === 'ERR_NETWORK') {
            return 'No internet connection. Please try again later.'
        }
    }

    return fallback
}
