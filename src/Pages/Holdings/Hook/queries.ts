import AxiosInstance from '@/Helpers/Axios'
import { Asset, UsersWithHoldings, UserWithHoldings } from '../TAsset'
import {
    fetchAllPaginatedData,
    matchesSearchText,
    normalizePaginatedResponse,
    paginateClientRows,
    PaginatedResponse,
} from '@/Helpers/clientTableFiltering'

const LIMIT = 5

export const getHoldings = async ({
    pageParam,
    users,
    search,
}: {
    pageParam: number
    users: string
    search: string
}): Promise<UsersWithHoldings> => {
    const fetchHoldingsPage = async (
        page: number,
        limit: number,
    ): Promise<PaginatedResponse<UserWithHoldings>> => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (search.trim()) {
            params.set('search', search)
        }

        if (users && users !== 'all') {
            params.set('users', users)
        }

        const response = await AxiosInstance.get(
            `/asset/user?${params.toString()}`,
        )
        return normalizePaginatedResponse(response.data)
    }

    const shouldFilterClientSide = search.trim() !== '' || users !== ''

    if (shouldFilterClientSide) {
        const allUsers =
            await fetchAllPaginatedData<UserWithHoldings>(fetchHoldingsPage)
        const filteredUsers = allUsers.filter((user) => {
            const assetCount = user.assets?.length ?? 0
            const matchesUserFilter =
                !users ||
                (users === 'with' && assetCount > 0) ||
                (users === 'without' && assetCount === 0)

            return (
                matchesUserFilter &&
                matchesSearchText(search, [
                    `${user.firstName} ${user.lastName}`,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.phone,
                    user.role,
                ])
            )
        })
        const paginatedUsers = paginateClientRows(
            filteredUsers,
            pageParam,
            LIMIT,
        )

        return {
            data: paginatedUsers.data,
            totalPages: paginatedUsers.totalPages,
            all: paginatedUsers.all,
        }
    }

    const response = await fetchHoldingsPage(pageParam, LIMIT)
    return {
        data: response.data,
        totalPages: response.totalPages ?? 1,
        all: response.all ?? response.data.length,
    }
}

export const getUserHoldings = async (
    userId: string,
): Promise<UserWithHoldings> => {
    return (await AxiosInstance.get(`/asset/user/${userId}`)).data
}

export const getItem = async (itemId: string): Promise<Asset> => {
    return (await AxiosInstance.get(`/asset/${itemId}`)).data
}

export const handleItemReturn = async (
    assetId: string,
    status: string,
    returnDate: string,
) => {
    const payload = {
        userId: null,
        returnDate: returnDate,
        status,
    }
    await AxiosInstance.patch(`/asset/${assetId}`, payload)
}

export const handleItemAssign = async (
    assetId: string,
    userId: string,
    date: string,
) => {
    const payload = {
        userId,
        takenDate: date,
    }
    await AxiosInstance.patch(`/asset/${assetId}`, payload)
}
