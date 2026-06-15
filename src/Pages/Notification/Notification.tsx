import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    AlertCircle,
    Bell,
    CheckCheck,
    Circle,
    Loader2,
    RefreshCw,
    X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
    Notification,
    NotificationPeriod,
    useGetAllNotifications,
} from './Hook/index'
import AxiosInstance from '@/Helpers/Axios'
import { useAuth } from '@/features/auth/context/AuthProvider'

const periodOptions: Array<{ label: string; value: NotificationPeriod }> = [
    { label: 'Today', value: 'today' },
    { label: 'This week', value: 'week' },
]

const getTypeStyles = (type: string, isRead: boolean) => {
    if (isRead) {
        return {
            dot: 'bg-slate-300',
            badge: 'border-slate-200 bg-slate-50 text-slate-500',
        }
    }

    switch (type) {
        case 'events':
            return {
                dot: 'bg-blue-500',
                badge: 'border-blue-100 bg-blue-50 text-blue-700',
            }
        case 'vacation':
        case 'allVacation':
            return {
                dot: 'bg-emerald-500',
                badge: 'border-emerald-100 bg-emerald-50 text-emerald-700',
            }
        case 'candidates':
        case 'allCandidates':
        case 'allApplication':
            return {
                dot: 'bg-violet-500',
                badge: 'border-violet-100 bg-violet-50 text-violet-700',
            }
        default:
            return {
                dot: 'bg-slate-400',
                badge: 'border-slate-200 bg-slate-50 text-slate-500',
            }
    }
}

const formatNotificationDate = (value: string) => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date)
}

const NotificationDropdown: React.FC = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [pendingNotificationIds, setPendingNotificationIds] = useState<
        Array<string | number>
    >([])
    const [isMarkingAll, setIsMarkingAll] = useState(false)
    const {
        notifications,
        setNotifications,
        isLoading,
        error,
        setError,
        retry,
        fetchForPeriod,
        currentPeriod,
    } = useGetAllNotifications() ?? {
        notifications: [],
        setNotifications: () => {},
        isLoading: false,
        error: null,
        setError: () => {},
        retry: () => Promise.resolve(),
        fetchForPeriod: () => Promise.resolve(),
        currentPeriod: 'today' as NotificationPeriod,
    }
    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications],
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    const getRouteByType = (notification: Notification) => {
        switch (notification.type) {
            case 'events':
                return `/events?${new URLSearchParams({
                    event: notification.typeId,
                    page: '0',
                    limit: '6',
                }).toString()}`
            case 'vacation':
                return `/vacation?${new URLSearchParams({
                    vacationType: 'requests',
                    selectedVacation: notification.typeId,
                    page: '0',
                    limit: '5',
                }).toString()}`
            case 'candidates':
                return `/view/${notification.typeId}`
            case 'allVacation':
                return '/vacation?vacationType=requests&page=0&limit=5'
            case 'allCandidates':
            case 'allApplication':
                return '/candidates?page=0&limit=5'
            default:
                return null
        }
    }

    const markNotificationAsRead = async (notification: Notification) => {
        if (
            notification.isRead ||
            !currentUser?._id ||
            pendingNotificationIds.includes(notification._id)
        ) {
            return true
        }

        try {
            setError(null)
            setPendingNotificationIds((ids) => [...ids, notification._id])
            await AxiosInstance.patch(
                `notification/${notification._id}/user/${currentUser._id}`,
            )
            setNotifications((currentNotifications) =>
                currentNotifications.map((item) =>
                    item._id === notification._id
                        ? { ...item, isRead: true }
                        : item,
                ),
            )
            return true
        } catch (error) {
            console.error(
                `Error marking notification ${notification._id} as read:`,
                error,
            )
            setError('Notification could not be marked as read.')
            return false
        } finally {
            setPendingNotificationIds((ids) =>
                ids.filter((id) => id !== notification._id),
            )
        }
    }

    const handleNotificationClick = async (notification: Notification) => {
        await markNotificationAsRead(notification)

        const route = getRouteByType(notification)
        if (route) {
            navigate(route)
            setIsOpen(false)
        }
    }

    const markAllAsRead = async () => {
        if (!currentUser?._id || isMarkingAll) {
            return
        }

        const unreadNotifications = notifications.filter(
            (notification) => !notification.isRead,
        )

        if (unreadNotifications.length === 0) {
            return
        }

        try {
            setError(null)
            setIsMarkingAll(true)
            setPendingNotificationIds((ids) => [
                ...ids,
                ...unreadNotifications.map((notification) => notification._id),
            ])

            const results = await Promise.allSettled(
                unreadNotifications.map((notification) =>
                    AxiosInstance.patch(
                        `notification/${notification._id}/user/${currentUser._id}`,
                    ).then(() => notification._id),
                ),
            )
            const markedIds = results
                .filter(
                    (
                        result,
                    ): result is PromiseFulfilledResult<string | number> =>
                        result.status === 'fulfilled',
                )
                .map((result) => result.value)

            if (markedIds.length > 0) {
                setNotifications((currentNotifications) =>
                    currentNotifications.map((notification) =>
                        markedIds.includes(notification._id)
                            ? { ...notification, isRead: true }
                            : notification,
                    ),
                )
            }

            if (markedIds.length !== unreadNotifications.length) {
                setError('Some notifications could not be marked as read.')
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error)
            setError('Notifications could not be marked as read.')
        } finally {
            setIsMarkingAll(false)
            setPendingNotificationIds((ids) =>
                ids.filter(
                    (id) =>
                        !unreadNotifications.some(
                            (notification) => notification._id === id,
                        ),
                ),
            )
        }
    }

    const handlePeriodChange = async (period: NotificationPeriod) => {
        if (period === currentPeriod && !error) {
            return
        }

        try {
            await fetchForPeriod(period)
        } catch (error) {
            console.error('Error fetching notification period:', error)
            setError('Notifications could not be loaded.')
        }
    }

    const handleRefresh = async () => {
        try {
            await retry()
        } catch (error) {
            console.error('Error refreshing notifications:', error)
            setError('Notifications could not be refreshed.')
        }
    }

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/25"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    role="menu"
                    aria-label="Notifications list"
                    className="fixed left-3 right-3 top-20 z-[70] max-h-[calc(100dvh-6rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-[30rem]"
                >
                    <div className="border-b border-slate-100 px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-slate-950">
                                    Notifications
                                </h2>
                                <p className="mt-0.5 text-xs font-medium text-slate-500">
                                    {unreadCount} unread, {notifications.length}{' '}
                                    shown
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:hidden"
                                aria-label="Close notifications"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="grid grid-cols-2 rounded-md border border-slate-200 bg-slate-100 p-1">
                                {periodOptions.map((option) => {
                                    const isActive =
                                        currentPeriod === option.value

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() =>
                                                handlePeriodChange(
                                                    option.value,
                                                )
                                            }
                                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                                isActive
                                                    ? 'bg-white text-[#2457a3] shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={14}
                                    className={isLoading ? 'animate-spin' : ''}
                                />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="max-h-[calc(100dvh-17rem)] overflow-y-auto p-3 sm:max-h-[28rem]">
                        {isLoading && (
                            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center text-sm font-medium text-slate-500">
                                <Loader2
                                    size={22}
                                    className="animate-spin text-[#2457a3]"
                                />
                                Loading notifications...
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                                <div className="flex gap-2">
                                    <AlertCircle
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {error}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleRefresh}
                                            className="mt-2 text-sm font-semibold text-rose-700 underline-offset-4 hover:underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isLoading &&
                            !error &&
                            notifications.length === 0 && (
                                <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            No notifications
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            New updates will appear here.
                                        </p>
                                    </div>
                                </div>
                            )}

                        {!isLoading &&
                            !error &&
                            notifications.map((notification) => {
                                const styles = getTypeStyles(
                                    notification.type,
                                    notification.isRead,
                                )
                                const isPending =
                                    pendingNotificationIds.includes(
                                        notification._id,
                                    )

                                return (
                                    <article
                                        key={notification._id}
                                        className={`mb-2 rounded-lg border p-3 transition ${
                                            notification.isRead
                                                ? 'border-slate-200 bg-white'
                                                : 'border-blue-100 bg-blue-50/35'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="block w-full text-left"
                                            onClick={() =>
                                                handleNotificationClick(
                                                    notification,
                                                )
                                            }
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <span
                                                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <h3 className="text-sm font-semibold leading-5 text-slate-900">
                                                            {notification.title}
                                                        </h3>
                                                        <span
                                                            className={`inline-flex w-fit shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold uppercase ${styles.badge}`}
                                                        >
                                                            {notification.isRead
                                                                ? 'Read'
                                                                : 'New'}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                                                        {notification.content}
                                                    </p>
                                                    {notification.date && (
                                                        <p className="mt-2 text-xs font-medium text-slate-400">
                                                            {formatNotificationDate(
                                                                notification.date,
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        <div className="mt-3 flex justify-end">
                                            <button
                                                type="button"
                                                aria-label={
                                                    notification.isRead
                                                        ? 'Notification already read'
                                                        : 'Mark notification as read'
                                                }
                                                disabled={
                                                    notification.isRead ||
                                                    isPending
                                                }
                                                onClick={(event) => {
                                                    event.stopPropagation()
                                                    markNotificationAsRead(
                                                        notification,
                                                    )
                                                }}
                                                className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {notification.isRead ? (
                                                    <CheckCheck size={14} />
                                                ) : isPending ? (
                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Circle size={14} />
                                                )}
                                                {notification.isRead
                                                    ? 'Read'
                                                    : isPending
                                                      ? 'Saving...'
                                                      : 'Mark as read'}
                                            </button>
                                        </div>
                                    </article>
                                )
                            })}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-medium text-slate-500">
                            {currentPeriod === 'today'
                                ? 'Showing today only'
                                : 'Showing the last 7 days'}
                        </p>
                        <button
                            type="button"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#2457a3] px-3 text-xs font-semibold text-white transition hover:bg-[#1c4380] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={unreadCount === 0 || isMarkingAll}
                            onClick={markAllAsRead}
                        >
                            {isMarkingAll ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <CheckCheck size={14} />
                            )}
                            {isMarkingAll ? 'Saving...' : 'Mark all as read'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationDropdown
