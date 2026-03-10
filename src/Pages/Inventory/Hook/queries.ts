import AxiosInstance from '@/Helpers/Axios'
import { InventoryItem } from '../types'

export const getAllInventoryItems = async (
    page: string = '1',
    limit: string = '10',
    search?: string,
): Promise<{ data: InventoryItem[]; totalPages: number }> => {
    const params = new URLSearchParams({
        page,
        limit,
    })

    if (search) {
        params.set('search', search)
    }

    const res = await AxiosInstance.get(`/asset?${params.toString()}`)
    return res.data
}

export const getOneInventoryItem = async (
    serial: string,
): Promise<InventoryItem> => {
    const res = await AxiosInstance.get(`/asset/sn/${serial}`)
    return res.data
}

export const createInventoryItem = async (
    type: 'laptop' | 'monitor',
    serialNumber: string,
) => {
    const res = await AxiosInstance.post(`/asset`, { type, serialNumber })
    return res.data
}
