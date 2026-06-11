import AxiosInstance from '@/Helpers/Axios'
import { Asset, UsersWithHoldings, UserWithHoldings } from '../TAsset'

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
    const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(LIMIT),
    })

    if (users) {
        params.set('users', users)
    }

    if (search) {
        params.set('search', search)
    }

    const response = await AxiosInstance.get(`/asset/user?${params.toString()}`)
    return {
        data: response.data.data,
        totalPages: response.data.totalPages,
        all: response.data.all,
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
