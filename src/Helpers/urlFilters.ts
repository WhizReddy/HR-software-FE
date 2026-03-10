export type UrlParamValue = string | number | null | undefined

interface EnsurePaginationOptions {
    pageKey?: string
    limitKey?: string
    defaultPage?: string
    defaultLimit?: string
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
): number => {
    const rawValue = params.get(key)
    if (!rawValue) {
        return fallback
    }

    const parsed = Number(rawValue)
    return Number.isFinite(parsed) ? parsed : fallback
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
    } = options

    const nextParams = new URLSearchParams(prevParams)

    if (!nextParams.get(pageKey)) {
        nextParams.set(pageKey, defaultPage)
    }

    if (!nextParams.get(limitKey)) {
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
