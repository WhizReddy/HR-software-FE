import React from 'react'
import { useAuth } from '@/features/auth/context/AuthProvider'
import Calendar from './components/calendar.tsx'
import CardInfo from './components/card.tsx'
import InfoSection from './components/infoSection.tsx'
import PieChartComponent from './components/piechart.tsx'
import { DashboardProvider, useDashboardContext } from './context/hook.tsx'
import { greeter } from '@/Helpers/Greeter.tsx'
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

    const userName = currentUser ? currentUser.firstName : 'User'
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'
    const nextInterviews = upcomingInterviews.slice(0, 3)
    const attentionItems = [
        {
            label: 'Pending vacation',
            value: formatAttentionCount(
                needsAttention.pendingVacations,
                needsAttention.isLoading,
            ),
            hint: 'Awaiting HR action',
            icon: ClipboardCheck,
            to: '/vacation?vacationType=requests&requestStatus=pending&requestPage=0&requestLimit=5',
            restricted: true,
        },
        {
            label: 'Active candidates',
            value: formatAttentionCount(
                needsAttention.activeCandidates,
                needsAttention.isLoading,
            ),
            hint: 'Open hiring records',
            icon: UserRoundCheck,
            to: '/candidates?status=active&page=0&limit=5',
            restricted: true,
        },
        {
            label: 'Upcoming interviews',
            value: formatAttentionCount(
                needsAttention.upcomingInterviews,
                needsAttention.isLoading,
            ),
            hint: 'Active candidates scheduled ahead',
            icon: BriefcaseBusiness,
            to: '/interview',
            restricted: true,
        },
        {
            label: 'Broken assets',
            value: formatAttentionCount(
                needsAttention.brokenAssets,
                needsAttention.isLoading,
            ),
            hint: 'Need repair or return',
            icon: PackageSearch,
            to: '/inventory?status=broken&page=0&limit=5',
            restricted: true,
        },
        {
            label: 'Upcoming events',
            value: String(upcomingEvents.length),
            hint: 'Scheduled from today onward',
            icon: CalendarClock,
            to: '/events?page=0&limit=6',
            restricted: false,
        },
    ].filter((item) => !item.restricted || needsAttention.canViewRestrictedItems)

    return (
        <div className="relative overflow-x-hidden">
            <div className="relative z-10 mx-auto w-full max-w-full space-y-5">
                <PageIntro
                    eyebrow="Dashboard"
                    title={`${greeter()}, ${userName}`}
                    description={
                        isAdmin
                            ? 'Check attendance, leave, and upcoming activity before starting the day.'
                            : undefined
                    }
                    actions={
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="inline-flex items-center gap-2 self-start rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            Open Team Directory
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
                            view is showing the safest available fallback
                            values.
                        </p>
                    </div>
                )}

                {attentionItems.length > 0 && (
                    <div className="rounded-lg border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Needs attention
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Work that may need a follow-up today.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {attentionItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onClick={() => navigate(item.to)}
                                        className="group flex min-h-[112px] items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/25"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-600">
                                                {item.label}
                                            </p>
                                            <p className="mt-2 text-2xl font-semibold leading-none text-slate-950">
                                                {item.value}
                                            </p>
                                            <p className="mt-2 truncate text-sm font-medium text-slate-500">
                                                {item.hint}
                                            </p>
                                        </div>
                                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-white">
                                            <Icon size={20} />
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                        {nextInterviews.length > 0 && (
                            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Next interviews
                                        </h3>
                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                            Active candidates with scheduled
                                            interview dates.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/interview')}
                                        className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                    >
                                        Open interviews
                                    </button>
                                </div>
                                <div className="grid gap-2 md:grid-cols-3">
                                    {nextInterviews.map((interview) => (
                                        <article
                                            key={interview.id}
                                            className="rounded-md border border-slate-200 bg-white px-3 py-3"
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
                                                      ).format(
                                                          'DD MMM, HH:mm',
                                                      )
                                                    : 'Date pending'}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 auto-rows-min">
                    <div className="xl:col-span-12 w-full">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                            <CardInfo
                                title="Present"
                                content={
                                    isStatsLoading
                                        ? '...'
                                        : employeeData.present.toString()
                                }
                            />
                            <CardInfo
                                title="Absent"
                                content={
                                    isStatsLoading
                                        ? '...'
                                        : employeeData.absent.toString()
                                }
                            />
                            <CardInfo
                                title="On Leave"
                                content={
                                    isStatsLoading
                                        ? '...'
                                        : employeeData.onLeave.toString()
                                }
                            />
                            <CardInfo
                                title="Remote"
                                content={
                                    isStatsLoading
                                        ? '...'
                                        : employeeData.remote.toString()
                                }
                            />
                        </div>
                    </div>

                    <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 xl:col-span-4">
                        <h3 className="mb-4 text-base font-semibold text-slate-900">
                            Calendar
                        </h3>
                        <div className="flex-1">
                            <Calendar />
                        </div>
                    </div>

                    <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 xl:col-span-4">
                        <InfoSection />
                    </div>

                    <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 xl:col-span-4">
                        <h3 className="mb-4 text-base font-semibold text-slate-900">
                            Status overview
                        </h3>
                        <p className="mb-6 text-sm font-medium leading-6 text-slate-500">
                            Built from total employees, remote work, and active
                            leave.
                        </p>
                        <div className="flex-1 flex items-center justify-center">
                            <PieChartComponent />
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6 xl:col-span-12">
                        <h3 className="mb-6 text-base font-semibold text-slate-900">
                            Team Directory
                        </h3>
                        {isUsersLoading ? (
                            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                                Loading team directory...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                                No employees are available in the team directory
                                yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                                {users.map((employee) => (
                                    <div
                                        key={employee._id}
                                        className="group flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-transparent p-3 transition-colors duration-200 hover:border-slate-200 hover:bg-slate-50"
                                        onClick={() =>
                                            navigate(`/profile/${employee._id}`)
                                        }
                                    >
                                        <div className="relative h-16 w-16">
                                            {employee.imageUrl ? (
                                                <img
                                                    src={employee.imageUrl}
                                                    alt={`${employee.firstName} ${employee.lastName}`}
                                                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-sm transition-all duration-300 group-hover:ring-slate-100"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-xl font-bold text-white ring-4 ring-white shadow-sm transition-all duration-300 group-hover:ring-slate-100">
                                                    {employee.firstName?.charAt(
                                                        0,
                                                    )}
                                                    {employee.lastName?.charAt(
                                                        0,
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full px-1 text-center">
                                            <p className="truncate text-sm font-semibold leading-tight text-slate-800 transition-colors group-hover:text-slate-600">
                                                {employee.firstName}{' '}
                                                {employee.lastName}
                                            </p>
                                            <p className="mt-1 truncate text-xs font-medium capitalize text-slate-500">
                                                {employee.role || 'Employee'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
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
