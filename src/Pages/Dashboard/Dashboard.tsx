import React from 'react'
import { useAuth } from '@/features/auth/context/AuthProvider'
import Calendar from './components/calendar.tsx'
import CardInfo from './components/card.tsx'
import InfoSection from './components/infoSection.tsx'
import PieChartComponent from './components/piechart.tsx'
import { DashboardProvider, useDashboardContext } from './context/hook.tsx'
import { useNavigate } from 'react-router-dom'
import {
    AlertCircle,
    ArrowUpRight,
    BriefcaseBusiness,
    CalendarClock,
    ClipboardCheck,
    PackageSearch,
    UserRoundCheck,
} from 'lucide-react'
import PageIntro from '@/Components/PageIntro/PageIntro'
import dayjs from 'dayjs'

const formatAttentionCount = (
    value: number | null,
    isLoading: boolean,
) => {
    if (isLoading) return '...'
    if (value === null) return '-'
    return String(value)
}

const DashboardContent: React.FC = () => {
    const {
        employeeData,
        users,
        upcomingEvents,
        upcomingInterviews,
        needsAttention,
        hasError,
        isStatsLoading,
        isUsersLoading,
    } = useDashboardContext()
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'
    const nextInterviews = upcomingInterviews.slice(0, 3)
    const teamPreview = users.slice(0, 6)
    const dashboardStats = [
        {
            title: 'Present' as const,
            content: isStatsLoading ? '...' : employeeData.present.toString(),
        },
        {
            title: 'Absent' as const,
            content: isStatsLoading ? '...' : employeeData.absent.toString(),
        },
        {
            title: 'On Leave' as const,
            content: isStatsLoading ? '...' : employeeData.onLeave.toString(),
        },
        {
            title: 'Remote' as const,
            content: isStatsLoading ? '...' : employeeData.remote.toString(),
        },
    ]
    const attentionItems = [
        {
            label: 'Review leave requests',
            value: formatAttentionCount(
                needsAttention.pendingVacations,
                needsAttention.isLoading,
            ),
            hint: 'Pending manager or HR decision',
            icon: ClipboardCheck,
            to: '/vacation?vacationType=requests&requestStatus=pending&requestPage=0&requestLimit=5',
            restricted: true,
        },
        {
            label: 'Move candidates forward',
            value: formatAttentionCount(
                needsAttention.activeCandidates,
                needsAttention.isLoading,
            ),
            hint: 'Active recruitment records',
            icon: UserRoundCheck,
            to: '/candidates?status=active&page=0&limit=5',
            restricted: true,
        },
        {
            label: 'Prepare interview schedule',
            value: formatAttentionCount(
                needsAttention.upcomingInterviews,
                needsAttention.isLoading,
            ),
            hint: 'Upcoming candidate meetings',
            icon: BriefcaseBusiness,
            to: '/interview',
            restricted: true,
        },
        {
            label: 'Resolve asset issues',
            value: formatAttentionCount(
                needsAttention.brokenAssets,
                needsAttention.isLoading,
            ),
            hint: 'Equipment needing follow-up',
            icon: PackageSearch,
            to: '/inventory?status=broken&page=0&limit=5',
            restricted: true,
        },
        {
            label: 'Review upcoming events',
            value: String(upcomingEvents.length),
            hint: 'HR activities from today onward',
            icon: CalendarClock,
            to: '/events?page=0&limit=6',
            restricted: false,
        },
    ].filter((item) => !item.restricted || needsAttention.canViewRestrictedItems)

    return (
        <div className="relative overflow-x-hidden">
            <div className="relative z-10 mx-auto w-full max-w-full space-y-3">
                <PageIntro
                    eyebrow={isAdmin ? 'People operations' : undefined}
                    title="Dashboard"
                    description="Overview of today’s HR activity, attendance, recruitment, and upcoming events."
                    actions={
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="inline-flex items-center gap-2 self-start rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            Open directory
                            <ArrowUpRight size={16} />
                        </button>
                    }
                />

                {hasError && (
                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                        <AlertCircle
                            size={18}
                            className="mt-0.5 flex-shrink-0"
                        />
                        <p>
                            Some dashboard metrics could not be loaded, so this
                            HR overview is showing the safest available
                            fallback values.
                        </p>
                    </div>
                )}

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Team today
                                    </h2>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Attendance and availability in one place.
                                    </p>
                                </div>
                                <p className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                                    {employeeData.total} total
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-[1180px]:grid-cols-4">
                                {dashboardStats.map((stat) => (
                                    <CardInfo
                                        key={stat.title}
                                        title={stat.title}
                                        content={stat.content}
                                    />
                                ))}
                            </div>
                        </div>

                        {attentionItems.length > 0 && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                                <div className="mb-3">
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Work queue
                                    </h2>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Open the item that needs attention.
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    {attentionItems.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                onClick={() => navigate(item.to)}
                                                className="group flex w-full items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/25"
                                            >
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 transition-colors group-hover:bg-white">
                                                    <Icon size={17} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-semibold text-slate-800">
                                                        {item.label}
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                                                        {item.hint}
                                                    </span>
                                                </span>
                                                <span className="shrink-0 text-lg font-semibold text-slate-950">
                                                    {item.value}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid gap-4">
                        <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4">
                            <h3 className="mb-3 text-base font-semibold text-slate-900">
                                HR calendar
                            </h3>
                            <Calendar />
                        </div>

                        {nextInterviews.length > 0 && (
                            <section className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-900">
                                            Next interviews
                                        </h2>
                                        <p className="mt-1 text-sm font-medium text-slate-500">
                                            Candidate meetings coming up.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/interview')}
                                        className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        Review schedule
                                    </button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {nextInterviews.map((interview) => (
                                        <article
                                            key={interview.id}
                                            className="rounded-md border border-slate-200 bg-slate-50/70 px-4 py-3"
                                        >
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {interview.fullName}
                                            </p>
                                            <p className="mt-1 text-xs font-medium capitalize text-slate-500">
                                                {interview.phase.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                            <p className="mt-2 text-xs font-semibold text-slate-700">
                                                {dayjs(
                                                    interview.interviewDate,
                                                ).isValid()
                                                    ? dayjs(
                                                          interview.interviewDate,
                                                      ).format('DD MMM, HH:mm')
                                                    : 'Date pending'}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <InfoSection />
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="mb-3">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Attendance mix
                                </h3>
                                <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                                    Today’s headcount split.
                                </p>
                            </div>
                            <PieChartComponent />
                        </div>

                        <section className="rounded-lg border border-slate-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Team shortcuts
                                    </h3>
                                    <p className="mt-1 text-sm font-medium text-slate-500">
                                        Recent employee profiles.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate('/employees')}
                                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                >
                                    View all
                                </button>
                            </div>
                            {isUsersLoading ? (
                                <div className="flex min-h-[96px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                                    Loading employee directory...
                                </div>
                            ) : teamPreview.length === 0 ? (
                                <div className="flex min-h-[96px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                                    No employee profiles are available yet.
                                </div>
                            ) : (
                                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                                    {teamPreview.map((employee) => (
                                        <button
                                            key={employee._id}
                                            type="button"
                                            className="group flex min-w-0 items-center gap-3 rounded-md border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-left transition-colors hover:border-slate-200 hover:bg-white"
                                            onClick={() =>
                                                navigate(
                                                    `/profile/${employee._id}`,
                                                )
                                            }
                                        >
                                            {employee.imageUrl ? (
                                                <img
                                                    src={employee.imageUrl}
                                                    alt={`${employee.firstName} ${employee.lastName}`}
                                                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                                                    {employee.firstName?.charAt(
                                                        0,
                                                    )}
                                                    {employee.lastName?.charAt(
                                                        0,
                                                    )}
                                                </span>
                                            )}
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-semibold text-slate-800">
                                                    {employee.firstName}{' '}
                                                    {employee.lastName}
                                                </span>
                                                <span className="block truncate text-xs font-medium capitalize text-slate-500">
                                                    {employee.role ||
                                                        'Employee'}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </section>
            </div>
        </div>
    )
}

const Dashboard: React.FC = () => {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    )
}

export default Dashboard
