export type UrlParamValue = string | number | null | undefined

interface EnsurePaginationOptions {
    pageKey?: string
    limitKey?: string
    defaultPage?: string
    defaultLimit?: string
    allowedLimits?: number[]
}

interface UpdateFilterOptions extends EnsurePaginationOptions {
    resetPage?: boolean
}

const DEFAULT_PAGE_KEY = 'page'
const DEFAULT_LIMIT_KEY = 'limit'
const DEFAULT_PAGE_VALUE = '0'
const DEFAULT_LIMIT_VALUE = '5'

export const parseNumberParam = (
    params: URLSearchParams,
    key: string,
    fallback: number,
    options: { min?: number; allowedValues?: number[] } = {},
): number => {
    const rawValue = params.get(key)
    if (!rawValue) {
        return fallback
    }

    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
        return fallback
    }

    if (options.min !== undefined && parsed < options.min) {
        return fallback
    }

    if (
        options.allowedValues?.length &&
        !options.allowedValues.includes(parsed)
    ) {
        return fallback
    }

    return parsed
}

export const ensurePaginationParams = (
    prevParams: URLSearchParams,
    options: EnsurePaginationOptions = {},
): URLSearchParams => {
    const {
        pageKey = DEFAULT_PAGE_KEY,
        limitKey = DEFAULT_LIMIT_KEY,
        defaultPage = DEFAULT_PAGE_VALUE,
        defaultLimit = DEFAULT_LIMIT_VALUE,
        allowedLimits,
    } = options

    const nextParams = new URLSearchParams(prevParams)
    const parsedDefaultPage = Number(defaultPage)
    const parsedDefaultLimit = Number(defaultLimit)
    const pageValue = parseNumberParam(nextParams, pageKey, parsedDefaultPage, {
        min: 0,
    })
    const limitValue = parseNumberParam(
        nextParams,
        limitKey,
        parsedDefaultLimit,
        {
            min: 1,
            allowedValues: allowedLimits,
        },
    )

    if (
        !nextParams.get(pageKey) ||
        String(pageValue) !== nextParams.get(pageKey)
    ) {
        nextParams.set(pageKey, defaultPage)
    }

    if (
        !nextParams.get(limitKey) ||
        String(limitValue) !== nextParams.get(limitKey)
    ) {
        nextParams.set(limitKey, defaultLimit)
    }

    return nextParams
}

export const upsertFilterParams = (
    prevParams: URLSearchParams,
    updates: Record<string, UrlParamValue>,
    options: UpdateFilterOptions = {},
): URLSearchParams => {
    const {
        resetPage = false,
        pageKey = DEFAULT_PAGE_KEY,
        limitKey = DEFAULT_LIMIT_KEY,
        defaultPage = DEFAULT_PAGE_VALUE,
        defaultLimit = DEFAULT_LIMIT_VALUE,
    } = options

    const nextParams = new URLSearchParams(prevParams)

    Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
            nextParams.delete(key)
            return
        }

        nextParams.set(key, String(value))
    })

    if (resetPage) {
        nextParams.set(pageKey, defaultPage)
        if (!nextParams.get(limitKey)) {
            nextParams.set(limitKey, defaultLimit)
        }
    }

    return nextParams
}

export const hasSearchParamsChanged = (
    prevParams: URLSearchParams,
    nextParams: URLSearchParams,
): boolean => prevParams.toString() !== nextParams.toString()
