import AxiosInstance from '@/Helpers/Axios'
import { InventoryItem } from '../types'

export const getAllInventoryItems = async (
    page: string = '0',
    limit: string = '5',
    search?: string,
    status?: string,
    type?: string,
): Promise<{ data: InventoryItem[]; totalPages?: number; all?: number }> => {
    const params = new URLSearchParams({
        page,
        limit,
    })

    if (search) {
        params.set('search', search)
    }

    if (status) {
        params.set('status', status)
    }

    if (type) {
        params.set('type', type)
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
