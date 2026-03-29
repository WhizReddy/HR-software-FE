import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetAllNotifications } from './Hook/index'
import AxiosInstance from '@/Helpers/Axios'
import { useAuth } from '@/features/auth/context/AuthProvider'

interface Notification {
    _id: number
    title: string
    type: string
    typeId: string
    content: string
    date: string
    isRead: boolean
}

const NotificationDropdown: React.FC = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const { notifications, setNotifications } = useGetAllNotifications() ?? {
        notifications: [],
        setNotifications: () => { },
    }
    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications],
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleToggleDropdown = () => setIsOpen((prev) => !prev)

    const removeNotification = async (notification: Notification) => {
        if (notification.isRead) {
            return
        }

        try {
            await AxiosInstance.patch(`notification/${notification._id}/user/${currentUser?._id}`)
            const updatedNotifications = notifications.map(n =>
                n._id === notification._id ? { ...n, isRead: true } : n
            )
            setNotifications(updatedNotifications)
        } catch (error) {
            console.error(
                `Error removing notification ${notification._id}:`,
                error,
            )
        }
    }

    const getRouteByType = (notification: Notification) => {
        switch (notification.type) {
            case 'events':
                return `/events?event=${notification.typeId}`
            case 'vacation':
                return `/vacation?vacationType=requests&selectedVacation=${notification.typeId}`
            case 'candidates':
                return `/view/${notification.typeId}`
            case 'allVacation':
                return '/vacation?vacationType=requests&page=0&limit=5'
            case 'allCandidates':
            case 'allApplication':
                return '/candidates'
            default:
                return null
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            removeNotification(notification)
        }

        const route = getRouteByType(notification)
        if (route) {
            navigate(route)
            setIsOpen(false)
        }
    }

    const getColorByType = (type: string, isRead: boolean) => {
        if (isRead) {
            return '#6C757D'
        }
        switch (type) {
            case 'events':
                return 'blue'
            case 'vacation':
                return 'green'
            case 'candidates':
                return 'purple'
            case 'allVacation':
                return 'green'
            case 'allCandidates':
            case 'allApplication':
                return 'purple'
            default:
                return '#6C757D'
        }
    }

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter((notification) => !notification.isRead)
            await Promise.all(
                unreadNotifications.map((notification) =>
                    AxiosInstance.patch(`notification/${notification._id}/user/${currentUser?._id}`),
                ),
            )

            if (unreadNotifications.length > 0) {
                const updatedNotifications = notifications.map((n) => ({ ...n, isRead: true }))
                setNotifications(updatedNotifications)
            }
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }

    const showAll = async () => {
        if (!currentUser?._id) {
            return
        }

        try {
            const result = await AxiosInstance.get(
                `notification/user/${currentUser?._id}?period=week`,
            )
            setNotifications(result.data)
        } catch (error) {
            console.error('Error showing all notifications:', error)
        }
    }

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                onClick={handleToggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div
                    role="menu"
                    aria-label="Notifications list"
                    className="absolute right-0 z-[60] mt-2 w-[min(92vw,28rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
                >
                    <div className="max-h-[26rem] overflow-y-auto p-2">
                        {notifications.length === 0 && (
                            <div className="px-3 py-8 text-center text-sm text-slate-500">
                                No notifications to show.
                            </div>
                        )}

                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="mb-2 cursor-pointer rounded-md border border-slate-100 bg-white shadow-sm transition-colors hover:bg-slate-50"
                                style={{
                                    borderBottomWidth: '4px',
                                    borderBottomColor: getColorByType(notification.type, notification.isRead),
                                }}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start justify-between gap-2 p-3">
                                    <div className="min-w-0">
                                        <h4 className="truncate text-sm font-semibold text-slate-800">
                                            {notification.title}
                                        </h4>
                                        <p className="truncate text-sm text-slate-600">
                                            {notification.content}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label={notification.isRead ? 'Notification already read' : 'Mark notification as read'}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeNotification(notification)
                                        }}
                                        className={`shrink-0 text-xs font-medium ${notification.isRead ? 'text-slate-400' : 'text-blue-600 hover:text-blue-800'
                                            }`}
                                    >
                                        {notification.isRead ? 'Read' : 'Mark as read'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                        {unreadCount > 0 && (
                            <button
                                className="text-sm text-slate-500 transition-colors hover:text-blue-600"
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}

                        <button
                            className="ml-auto text-sm text-slate-500 transition-colors hover:text-blue-600"
                            onClick={showAll}
                        >
                            Show all
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown
