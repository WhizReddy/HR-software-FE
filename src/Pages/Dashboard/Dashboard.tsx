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
    Sparkles,
    UserRoundCheck,
} from 'lucide-react'

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
        needsAttention,
        hasError,
        isStatsLoading,
        isUsersLoading,
    } = useDashboardContext()
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const userName = currentUser ? currentUser.firstName : 'User'
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'
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
                <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase text-[#2457a3]">
                                <Sparkles size={12} />
                                Daily Snapshot
                            </p>
                            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
                                {greeter()}, {userName}
                            </h1>
                            {isAdmin && (
                                <p className="mt-2 max-w-xl text-sm font-medium text-slate-500 sm:text-base">
                                    Check attendance, leave, and upcoming
                                    activity before starting the day.
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="inline-flex items-center gap-2 self-start rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            Open Team Directory
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>

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
                    <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
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
                                        className="group flex min-h-[112px] items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-[#2457a3]/30 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/20"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase text-slate-500">
                                                {item.label}
                                            </p>
                                            <p className="mt-2 text-3xl font-semibold leading-none text-slate-950">
                                                {item.value}
                                            </p>
                                            <p className="mt-2 truncate text-sm font-medium text-slate-500">
                                                {item.hint}
                                            </p>
                                        </div>
                                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#2457a3] transition-colors group-hover:bg-white">
                                            <Icon size={20} />
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
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

                    <div className="flex h-full flex-col rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] xl:col-span-4">
                        <h3 className="mb-4 text-base font-semibold text-slate-900">
                            Calendar
                        </h3>
                        <div className="flex-1">
                            <Calendar />
                        </div>
                    </div>

                    <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] xl:col-span-4">
                        <InfoSection />
                    </div>

                    <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] xl:col-span-4">
                        <h3 className="mb-4 text-base font-semibold text-slate-900">
                            Status Overview
                        </h3>
                        <p className="mb-6 text-sm font-medium leading-6 text-slate-500">
                            Built from total employees, remote work, and active
                            leave.
                        </p>
                        <div className="flex-1 flex items-center justify-center">
                            <PieChartComponent />
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] xl:col-span-12">
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
                                                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-sm transition-all duration-300 group-hover:ring-blue-100"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-xl font-bold text-white ring-4 ring-white shadow-sm transition-all duration-300 group-hover:ring-blue-100">
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
                                            <p className="truncate text-sm font-semibold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
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
