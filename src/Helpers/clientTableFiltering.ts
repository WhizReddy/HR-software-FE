export interface PaginatedResponse<T> {
    data: T[]
    totalPages?: number
    all?: number
}

export const normalizePaginatedResponse = <T>(
    payload: T[] | PaginatedResponse<T>,
): PaginatedResponse<T> => {
    if (Array.isArray(payload)) {
        return {
            data: payload,
            totalPages: 1,
            all: payload.length,
        }
    }

    return {
        ...payload,
        data: Array.isArray(payload.data) ? payload.data : [],
    }
}

export const fetchAllPaginatedData = async <T>(
    fetchPage: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
    pageLimit = 100,
): Promise<T[]> => {
    const firstPage = await fetchPage(0, pageLimit)
    const totalPages =
        typeof firstPage.totalPages === 'number' && firstPage.totalPages > 0
            ? firstPage.totalPages
            : typeof firstPage.all === 'number' && firstPage.all > pageLimit
              ? Math.ceil(firstPage.all / pageLimit)
              : 1

    if (totalPages <= 1) {
        return firstPage.data
    }

    const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPage(index + 1, pageLimit),
        ),
    )

    return [...firstPage.data, ...remainingPages.flatMap((page) => page.data)]
}

export const paginateClientRows = <T>(
    rows: T[],
    page: number,
    pageSize: number,
): Required<PaginatedResponse<T>> => {
    const start = page * pageSize
    const data = rows.slice(start, start + pageSize)
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

    return {
        data,
        totalPages,
        all: rows.length,
    }
}

export const normalizeFilterText = (value: unknown): string =>
    String(value ?? '')
        .trim()
        .toLowerCase()

export const matchesSearchText = (
    query: string,
    values: unknown[],
): boolean => {
    const normalizedQuery = normalizeFilterText(query)

    if (!normalizedQuery) {
        return true
    }

    return values.some((value) =>
        normalizeFilterText(value).includes(normalizedQuery),
    )
}
