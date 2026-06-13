import { useAuth } from '@/features/auth/context/AuthProvider'
import AxiosInstance from '@/Helpers/Axios'
import { useCallback, useEffect, useState } from 'react'
interface Notification {
    _id: string | number
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
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNotifications = useCallback(
        async (userId: string, period = 'today') => {
            setIsLoading(true)
            setError(null)
            try {
                const params = new URLSearchParams({ period })
                const response = await AxiosInstance.get(
                    `notification/user/${userId}?${params.toString()}`,
                )
                setNotifications(response.data)
            } catch (error) {
                console.error('Error fetching notifications:', error)
                setError('Notifications could not be loaded.')
            } finally {
                setIsLoading(false)
            }
        },
        [],
    )

    useEffect(() => {
        if (currentUserId) {
            void fetchNotifications(currentUserId.toString())
        }
    }, [currentUserId, fetchNotifications])

    const retry = useCallback(() => {
        if (currentUserId) {
            void fetchNotifications(currentUserId.toString())
        }
    }, [currentUserId, fetchNotifications])

    const fetchForPeriod = useCallback(
        (period: string) => {
            if (!currentUserId) {
                return Promise.resolve()
            }

            return fetchNotifications(currentUserId.toString(), period)
        },
        [currentUserId, fetchNotifications],
    )

    return {
        notifications,
        setNotifications,
        isLoading,
        error,
        setError,
        retry,
        fetchForPeriod,
    }
}
