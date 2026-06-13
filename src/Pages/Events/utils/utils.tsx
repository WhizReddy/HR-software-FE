import AxiosInstance from '@/Helpers/Axios'
import { EventsData } from '../Interface/Events'
import {
    normalizePaginatedResponse,
    type PaginatedResponse,
} from '@/Helpers/clientTableFiltering'

export const fetchEvents = async (
    search: string,
    pageParam: number,
    limit: number = 6,
): Promise<PaginatedResponse<EventsData>> => {
    const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(limit),
    })

    if (search) {
        params.set('search', search)
    }

    const response = await AxiosInstance.get<
        EventsData[] | PaginatedResponse<EventsData>
    >(`/event?${params}`)
    return normalizePaginatedResponse(response.data)
}
