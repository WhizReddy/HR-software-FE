import AxiosInstance from '@/Helpers/Axios'
import { EventsData } from '../Interface/Events'

export const fetchEvents = async (
    search: string,
    pageParam: number,
    limit: number = 6,
): Promise<EventsData[]> => {
    const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(limit),
    })

    if (search) {
        params.set('search', search)
    }

    const response = await AxiosInstance.get<EventsData[]>(`/event?${params}`)
    return response.data
}
