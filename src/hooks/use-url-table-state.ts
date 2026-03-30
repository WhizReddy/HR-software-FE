import { useCallback, useEffect, useMemo, useState } from 'react'
import { PaginationModel } from '@/types/table'
import { useDebouncedValue } from './use-debounced-value'
import {
    ensurePaginationParams,
    hasSearchParamsChanged,
    parseNumberParam,
    type UrlParamValue,
    upsertFilterParams,
} from '@/Helpers/urlFilters'

type SearchParamUpdater =
    | URLSearchParams
    | ((prev: URLSearchParams) => URLSearchParams)

type SearchParamSetter = (nextInit: SearchParamUpdater) => void

interface UseUrlTableStateOptions {
    searchParams: URLSearchParams
    setSearchParams: SearchParamSetter
    searchKey?: string
    pageKey?: string
    limitKey?: string
    defaultPage?: number
    defaultPageSize?: number
    debounceMs?: number
    ensurePagination?: boolean
    resetPageOnSearch?: boolean
    additionalSearchUpdates?: Record<string, UrlParamValue>
}

export const useUrlTableState = ({
    searchParams,
    setSearchParams,
    searchKey = 'search',
    pageKey = 'page',
    limitKey = 'limit',
    defaultPage = 0,
    defaultPageSize = 5,
    debounceMs = 400,
    ensurePagination = true,
    resetPageOnSearch = ensurePagination,
    additionalSearchUpdates,
}: UseUrlTableStateOptions) => {
    const appliedSearch = searchParams.get(searchKey) || ''
    const [searchValue, setSearchValue] = useState(appliedSearch)
    const debouncedSearch = useDebouncedValue(searchValue, debounceMs)
    const additionalSearchUpdatesKey = JSON.stringify(
        additionalSearchUpdates ?? {},
    )
    const stableAdditionalSearchUpdates = useMemo(
        () =>
            JSON.parse(additionalSearchUpdatesKey) as Record<
                string,
                UrlParamValue
            >,
        [additionalSearchUpdatesKey],
    )

    useEffect(() => {
        if (!ensurePagination) {
            return
        }

        setSearchParams((prev) => {
            const nextParams = ensurePaginationParams(prev, {
                pageKey,
                limitKey,
                defaultPage: String(defaultPage),
                defaultLimit: String(defaultPageSize),
            })

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [
        defaultPage,
        defaultPageSize,
        ensurePagination,
        limitKey,
        pageKey,
        setSearchParams,
    ])

    useEffect(() => {
        setSearchValue((currentValue) =>
            currentValue === appliedSearch ? currentValue : appliedSearch,
        )
    }, [appliedSearch])

    useEffect(() => {
        const normalizedSearch = debouncedSearch.trim()

        if (normalizedSearch === appliedSearch) {
            return
        }

        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                {
                    [searchKey]: normalizedSearch || null,
                    ...stableAdditionalSearchUpdates,
                },
                {
                    resetPage: resetPageOnSearch,
                    pageKey,
                    limitKey,
                    defaultPage: String(defaultPage),
                    defaultLimit: String(defaultPageSize),
                },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [
        appliedSearch,
        debouncedSearch,
        defaultPage,
        defaultPageSize,
        limitKey,
        pageKey,
        resetPageOnSearch,
        searchKey,
        setSearchParams,
        stableAdditionalSearchUpdates,
    ])

    const clearSearch = useCallback(() => {
        setSearchValue('')

        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                {
                    [searchKey]: null,
                    ...stableAdditionalSearchUpdates,
                },
                {
                    resetPage: resetPageOnSearch,
                    pageKey,
                    limitKey,
                    defaultPage: String(defaultPage),
                    defaultLimit: String(defaultPageSize),
                },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [
        defaultPage,
        defaultPageSize,
        limitKey,
        pageKey,
        resetPageOnSearch,
        searchKey,
        setSearchParams,
        stableAdditionalSearchUpdates,
    ])

    const page = ensurePagination
        ? parseNumberParam(searchParams, pageKey, defaultPage)
        : defaultPage

    const pageSize = ensurePagination
        ? parseNumberParam(searchParams, limitKey, defaultPageSize)
        : defaultPageSize

    const handlePaginationModelChange = useCallback(
        (model: PaginationModel) => {
            if (!ensurePagination) {
                return
            }

            setSearchParams((prev) => {
                const nextParams = upsertFilterParams(
                    prev,
                    {
                        [pageKey]: model.page.toString(),
                        [limitKey]: model.pageSize.toString(),
                    },
                    {
                        pageKey,
                        limitKey,
                        defaultPage: String(defaultPage),
                        defaultLimit: String(defaultPageSize),
                    },
                )

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            })
        },
        [
            defaultPage,
            defaultPageSize,
            ensurePagination,
            limitKey,
            pageKey,
            setSearchParams,
        ],
    )

    return {
        searchValue,
        setSearchValue,
        searchQuery: appliedSearch.trim(),
        clearSearch,
        page,
        pageSize,
        handlePaginationModelChange,
    }
}
