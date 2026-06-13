import React, { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import AxiosInstance from '@/Helpers/Axios'
import { EventsData } from '../../Events/Interface/Events'
import { UserProfileData } from '../../Employees/interfaces/Employe'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'

interface EmployeeData {
    present: number
    absent: number
    onLeave: number
    remote: number
    total: number
}

export interface DashboardCalendarItem {
    id: string
    title: string
    startDate: string
    endDate?: string
    kind: 'event' | 'vacation' | 'interview'
}

interface DashboardContextType {
    employeeData: EmployeeData
    users: UserProfileData[]
    events: EventsData[]
    upcomingEvents: EventsData[]
    calendarItems: DashboardCalendarItem[]
    needsAttention: {
        pendingVacations: number | null
        activeCandidates: number | null
        brokenAssets: number | null
        upcomingEvents: number
        isLoading: boolean
        canViewRestrictedItems: boolean
    }
    isLoading: boolean
    isUsersLoading: boolean
    isEventsLoading: boolean
    isCalendarLoading: boolean
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

const normalizeArrayPayload = <T,>(payload: unknown): T[] => {
    if (Array.isArray(payload)) {
        return payload as T[]
    }

    if (
        payload &&
        typeof payload === 'object' &&
        Array.isArray((payload as { data?: unknown }).data)
    ) {
        return (payload as { data: T[] }).data
    }

    return []
}

const fetchTotalCount = async (url: string) => {
    const response = await AxiosInstance.get(url)
    const payload = response.data

    if (typeof payload?.all === 'number') {
        return payload.all
    }

    if (Array.isArray(payload?.data)) {
        return payload.data.length
    }

    if (Array.isArray(payload)) {
        return payload.length
    }

    return 0
}

interface DashboardVacation {
    _id: string
    type: string
    startDate: string
    endDate: string
    userId?: {
        firstName?: string
        lastName?: string
    }
}

interface DashboardApplicant {
    _id: string
    firstName?: string
    lastName?: string
    firstInterviewDate?: string | null
    secondInterviewDate?: string | null
}

const fetchAcceptedVacations = async (): Promise<DashboardVacation[]> => {
    const response = await AxiosInstance.get(
        '/vacation?page=0&limit=100&status=accepted',
    )
    return normalizeArrayPayload<DashboardVacation>(response.data)
}

const fetchInterviewApplicants = async (): Promise<DashboardApplicant[]> => {
    const response = await AxiosInstance.get('/applicant?page=0&limit=100')
    return normalizeArrayPayload<DashboardApplicant>(response.data)
}

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { userRole } = useAuth()
    const canViewRestrictedItems = isAdminRole(userRole)
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
        data: acceptedVacations = [],
        isLoading: isAcceptedVacationsLoading,
    } = useQuery({
        queryKey: ['dashboard', 'calendar', 'accepted-vacations'],
        queryFn: fetchAcceptedVacations,
        enabled: canViewRestrictedItems,
        retry: false,
    })

    const {
        data: interviewApplicants = [],
        isLoading: isInterviewApplicantsLoading,
    } = useQuery({
        queryKey: ['dashboard', 'calendar', 'interviews'],
        queryFn: fetchInterviewApplicants,
        enabled: canViewRestrictedItems,
        retry: false,
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

    const {
        data: pendingVacations = null,
        isLoading: isPendingVacationsLoading,
    } = useQuery({
        queryKey: ['dashboard', 'needs-attention', 'pending-vacations'],
        queryFn: () =>
            fetchTotalCount('/vacation?page=0&limit=1&status=pending'),
        enabled: canViewRestrictedItems,
        retry: false,
    })

    const {
        data: activeCandidates = null,
        isLoading: isActiveCandidatesLoading,
    } = useQuery({
        queryKey: ['dashboard', 'needs-attention', 'active-candidates'],
        queryFn: () =>
            fetchTotalCount('/applicant?page=0&limit=1&status=active'),
        enabled: canViewRestrictedItems,
        retry: false,
    })

    const { data: brokenAssets = null, isLoading: isBrokenAssetsLoading } =
        useQuery({
            queryKey: ['dashboard', 'needs-attention', 'broken-assets'],
            queryFn: () =>
                fetchTotalCount('/asset?page=0&limit=1&status=broken'),
            enabled: canViewRestrictedItems,
            retry: false,
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

    const eventCalendarItems: DashboardCalendarItem[] = sortedEvents.map(
        (event) => ({
            id: `event-${event._id}`,
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate,
            kind: 'event',
        }),
    )

    const vacationCalendarItems: DashboardCalendarItem[] =
        acceptedVacations.map((vacation) => {
            const fullName = [
                vacation.userId?.firstName,
                vacation.userId?.lastName,
            ]
                .filter(Boolean)
                .join(' ')

            return {
                id: `vacation-${vacation._id}`,
                title: fullName
                    ? `${fullName} on leave`
                    : `${vacation.type} leave`,
                startDate: vacation.startDate,
                endDate: vacation.endDate,
                kind: 'vacation',
            }
        })

    const interviewCalendarItems: DashboardCalendarItem[] =
        interviewApplicants.flatMap((applicant) => {
            const fullName =
                [applicant.firstName, applicant.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Candidate'

            return [
                applicant.firstInterviewDate
                    ? {
                          id: `interview-first-${applicant._id}`,
                          title: `${fullName} first interview`,
                          startDate: applicant.firstInterviewDate,
                          kind: 'interview' as const,
                      }
                    : null,
                applicant.secondInterviewDate
                    ? {
                          id: `interview-second-${applicant._id}`,
                          title: `${fullName} second interview`,
                          startDate: applicant.secondInterviewDate,
                          kind: 'interview' as const,
                      }
                    : null,
            ].filter(Boolean) as DashboardCalendarItem[]
        })

    const calendarItems = [
        ...eventCalendarItems,
        ...(canViewRestrictedItems ? vacationCalendarItems : []),
        ...(canViewRestrictedItems ? interviewCalendarItems : []),
    ]

    const isCalendarLoading =
        isEventsLoading ||
        (canViewRestrictedItems &&
            (isAcceptedVacationsLoading || isInterviewApplicantsLoading))

    const needsAttention = {
        pendingVacations,
        activeCandidates,
        brokenAssets,
        upcomingEvents: upcomingEvents.length,
        isLoading:
            canViewRestrictedItems &&
            (isPendingVacationsLoading ||
                isActiveCandidatesLoading ||
                isBrokenAssetsLoading),
        canViewRestrictedItems,
    }

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
                calendarItems,
                needsAttention,
                isLoading,
                isUsersLoading,
                isEventsLoading,
                isCalendarLoading,
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
