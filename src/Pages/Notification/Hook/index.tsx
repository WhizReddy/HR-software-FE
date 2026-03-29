import { useAuth } from '@/features/auth/context/AuthProvider'
import AxiosInstance from '@/Helpers/Axios'
import { useEffect, useState } from 'react'
interface Notification {
    _id: number
    title: string
    type: string
    typeId: string
    content: string
    date: string
    isRead: boolean
}
export const useGetAllNotifications = () => {
    const { currentUser } = useAuth()
    const currentUserId = currentUser?._id
    const [notifications, setNotifications] = useState<Notification[]>([])
    const fetchNotifications = async (userId: string) => {
        try {
            const response = await AxiosInstance.get(
                `notification/user/${userId}?period=today`,
            )
            setNotifications(response.data)
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }
    useEffect(() => {
        if (currentUserId) {
            fetchNotifications(currentUserId.toString())
        }
    }, [currentUserId])
    return { notifications, setNotifications }
}
