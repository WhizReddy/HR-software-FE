import { AxiosError } from 'axios'

const extractErrorText = (value: unknown): string | null => {
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed.length > 0 ? trimmed : null
    }

    if (Array.isArray(value)) {
        const messages = value
            .map((item) => extractErrorText(item))
            .filter((item): item is string => Boolean(item))

        return messages.length > 0 ? messages.join(', ') : null
    }

    if (value && typeof value === 'object') {
        if ('message' in value) {
            return extractErrorText((value as { message?: unknown }).message)
        }

        if ('error' in value) {
            return extractErrorText((value as { error?: unknown }).error)
        }
    }

    return null
}

export const getVacationErrorMessage = (
    error: unknown,
    fallback: string,
) => {
    if (error instanceof AxiosError) {
        const responseMessage = extractErrorText(error.response?.data)

        if (responseMessage) {
            return responseMessage
        }
    }

    if (error instanceof Error) {
        const errorMessage = extractErrorText(error.message)

        if (errorMessage) {
            return errorMessage
        }
    }

    return fallback
}
