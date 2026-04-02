import { Clock3, LucideIcon, Monitor, UserCheck, UserX } from 'lucide-react'

export type StatusKey = 'Present' | 'Absent' | 'On Leave' | 'Remote'

export const statusOrder: StatusKey[] = [
    'Present',
    'Absent',
    'On Leave',
    'Remote',
]

export const statusConfig: Record<
    StatusKey,
    {
        icon: LucideIcon
        chartColor: string
        gradient: string
        badgeClassName: string
    }
> = {
    Present: {
        icon: UserCheck,
        chartColor: '#10b981',
        gradient: 'from-emerald-500 to-green-400',
        badgeClassName: 'bg-emerald-500',
    },
    Absent: {
        icon: UserX,
        chartColor: '#f43f5e',
        gradient: 'from-rose-500 to-red-400',
        badgeClassName: 'bg-rose-500',
    },
    'On Leave': {
        icon: Clock3,
        chartColor: '#f59e0b',
        gradient: 'from-amber-500 to-orange-400',
        badgeClassName: 'bg-amber-500',
    },
    Remote: {
        icon: Monitor,
        chartColor: '#3b82f6',
        gradient: 'from-blue-500 to-cyan-400',
        badgeClassName: 'bg-blue-500',
    },
}
