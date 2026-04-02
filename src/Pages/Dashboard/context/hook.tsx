import React, { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import AxiosInstance from '@/Helpers/Axios'
import { EventsData } from '../../Events/Interface/Events'
import { UserProfileData } from '../../Employees/interfaces/Employe'

interface EmployeeData {
    present: number
    absent: number
    onLeave: number
    remote: number
    total: number
}

interface DashboardContextType {
    employeeData: EmployeeData
    users: UserProfileData[]
    events: EventsData[]
    upcomingEvents: EventsData[]
    isLoading: boolean
    isUsersLoading: boolean
    isEventsLoading: boolean
    isStatsLoading: boolean
    hasError: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined,
)

const normalizeCount = (value: unknown) => {
    if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
        return 0
    }

    return Math.floor(value)
}

const getEventDate = (event: EventsData) => {
    const startDate = dayjs(event.startDate)
    if (startDate.isValid()) {
        return startDate
    }

    return dayjs(event.endDate)
}

const getEventTimestamp = (event: EventsData) => {
    const eventDate = getEventDate(event)
    return eventDate.isValid() ? eventDate.valueOf() : Number.MAX_SAFE_INTEGER
}

const fetchCount = async (url: string) => {
    const response = await AxiosInstance.get(url)
    return normalizeCount(response.data)
}

const fetchUsers = async (): Promise<UserProfileData[]> => {
    const response = await AxiosInstance.get('/user')
    return Array.isArray(response.data) ? response.data : []
}

const fetchEvents = async (): Promise<EventsData[]> => {
    const response = await AxiosInstance.get('/event')
    return Array.isArray(response.data) ? response.data : []
}

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const {
        data: users = [],
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useQuery({
        queryKey: ['dashboard', 'users'],
        queryFn: fetchUsers,
    })

    const {
        data: events = [],
        isLoading: isEventsLoading,
        isError: isEventsError,
    } = useQuery({
        queryKey: ['dashboard', 'events'],
        queryFn: fetchEvents,
    })

    const {
        data: inOfficeRaw = 0,
        isLoading: isInOfficeLoading,
        isError: isInOfficeError,
    } = useQuery({
        queryKey: ['dashboard', 'stats', 'in-office'],
        queryFn: () => fetchCount('/user/remote/false'),
    })

    const {
        data: remoteRaw = 0,
        isLoading: isRemoteLoading,
        isError: isRemoteError,
    } = useQuery({
        queryKey: ['dashboard', 'stats', 'remote'],
        queryFn: () => fetchCount('/user/remote/true'),
    })

    const {
        data: onLeaveRaw = 0,
        isLoading: isOnLeaveLoading,
        isError: isOnLeaveError,
    } = useQuery({
        queryKey: ['dashboard', 'stats', 'on-leave'],
        queryFn: () => fetchCount('/vacation/onLeave'),
    })

    const totalEmployees = users.length
    const remote = Math.min(remoteRaw, totalEmployees)
    const onLeave = Math.min(onLeaveRaw, totalEmployees)
    const availableHeadcount = Math.max(0, totalEmployees - remote - onLeave)
    const present = Math.min(inOfficeRaw, availableHeadcount)
    const absent = Math.max(0, availableHeadcount - present)

    const employeeData: EmployeeData = {
        present,
        absent,
        onLeave,
        remote,
        total: totalEmployees,
    }

    const sortedEvents = [...events].sort(
        (firstEvent, secondEvent) =>
            getEventTimestamp(firstEvent) - getEventTimestamp(secondEvent),
    )

    const today = dayjs().startOf('day')
    const upcomingEvents = sortedEvents.filter((event) => {
        const lastRelevantDay = dayjs(event.endDate || event.startDate).endOf('day')
        return lastRelevantDay.isValid() && !lastRelevantDay.isBefore(today)
    })

    const isStatsLoading =
        isUsersLoading || isInOfficeLoading || isRemoteLoading || isOnLeaveLoading
    const isLoading = isStatsLoading || isEventsLoading
    const hasError =
        isUsersError ||
        isEventsError ||
        isInOfficeError ||
        isRemoteError ||
        isOnLeaveError

    return (
        <DashboardContext.Provider
            value={{
                employeeData,
                users,
                events: sortedEvents,
                upcomingEvents,
                isLoading,
                isUsersLoading,
                isEventsLoading,
                isStatsLoading,
                hasError,
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}

export const useDashboardContext = () => {
    const context = useContext(DashboardContext)
    if (context === undefined) {
        throw new Error(
            'useDashboardContext must be used within a DashboardProvider',
        )
    }
    return context
}
