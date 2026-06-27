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
        label: string
        icon: LucideIcon
        chartColor: string
        gradient: string
        badgeClassName: string
    }
> = {
    Present: {
        label: 'Present today',
        icon: UserCheck,
        chartColor: '#334155',
        gradient: 'from-slate-700 to-slate-500',
        badgeClassName: 'bg-slate-700',
    },
    Absent: {
        label: 'Absent today',
        icon: UserX,
        chartColor: '#94a3b8',
        gradient: 'from-slate-400 to-slate-300',
        badgeClassName: 'bg-slate-400',
    },
    'On Leave': {
        label: 'On approved leave',
        icon: Clock3,
        chartColor: '#059669',
        gradient: 'from-emerald-600 to-emerald-400',
        badgeClassName: 'bg-emerald-600',
    },
    Remote: {
        label: 'Working remotely',
        icon: Monitor,
        chartColor: '#d97706',
        gradient: 'from-amber-600 to-amber-400',
        badgeClassName: 'bg-amber-500',
    },
}
