import React from 'react'
import { useAuth } from '@/features/auth/context/AuthProvider'
import Calendar from './components/calendar.tsx'
import CardInfo from './components/card.tsx'
import InfoSection from './components/infoSection.tsx'
import PieChartComponent from './components/piechart.tsx'
import { DashboardProvider, useDashboardContext } from './context/hook.tsx'
import { greeter } from '@/Helpers/Greeter.tsx'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react'

const DashboardContent: React.FC = () => {
    const { employeeData, users, hasError, isStatsLoading, isUsersLoading } =
        useDashboardContext()
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const userName = currentUser ? currentUser.firstName : 'User'
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'

    return (
        <div className="relative overflow-x-hidden">
            <div className="relative mx-auto max-w-[1400px] space-y-6 p-2 sm:p-4 lg:p-6 z-10">
                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-[#1f4d94] via-[#2a61b4] to-[#18376a] p-6 text-white shadow-2xl shadow-blue-900/20 sm:p-8">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                                <Sparkles size={12} />
                                Daily Snapshot
                            </p>
                            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                {greeter()}, {userName}
                            </h1>
                            {isAdmin && (
                                <p className="mt-2 max-w-xl text-sm font-medium text-blue-100/90 sm:text-base">
                                    Review your team health, approvals, and activity from one streamlined command center.
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="inline-flex items-center gap-2 self-start rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Open Team Directory
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>

                {hasError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <p>
                            Some dashboard metrics could not be loaded, so this view is
                            showing the safest available fallback values.
                        </p>
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

                    <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-4 h-full flex flex-col">
                        <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Calendar</h3>
                        <div className="flex-1">
                            <Calendar />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-4 min-h-[500px] flex flex-col">
                        <InfoSection />
                    </div>

                    <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-4 min-h-[500px] flex flex-col">
                        <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Status Overview</h3>
                        <p className="mb-6 text-sm font-medium leading-6 text-slate-500">
                            Built from total employees, remote work, and active leave.
                        </p>
                        <div className="flex-1 flex items-center justify-center">
                            <PieChartComponent />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-12">
                        <h3 className="text-base font-bold text-slate-800 mb-6 tracking-tight">Team Directory</h3>
                        {isUsersLoading ? (
                            <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                                Loading team directory...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                                No employees were returned for the team directory.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                                {users.map((employee) => (
                                    <div
                                        key={employee._id}
                                        className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:-translate-y-1 hover:border-slate-100 hover:bg-white hover:shadow-md"
                                        onClick={() => navigate(`/profile/${employee._id}`)}
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
                                                    {employee.firstName?.charAt(0)}
                                                    {employee.lastName?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full px-1 text-center">
                                            <p className="truncate text-sm font-semibold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
                                                {employee.firstName} {employee.lastName}
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
