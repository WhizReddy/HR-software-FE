import dayjs from 'dayjs'
import { AlertCircle, CalendarDays, Clock3, Monitor, Users } from 'lucide-react'
import PageIntro from '@/Components/PageIntro/PageIntro'
import {
    DashboardProvider,
    useDashboardContext,
} from '@/Pages/Dashboard/context/hook'
import {
    statusConfig,
    statusOrder,
} from '@/Pages/Dashboard/components/statusConfig'

const formatPercent = (value: number, total: number) => {
    if (total <= 0) return '0%'
    return `${Math.round((value / total) * 100)}%`
}

const AnalyticsContent = () => {
    const {
        employeeData,
        upcomingEvents,
        isStatsLoading,
        isEventsLoading,
        hasError,
    } = useDashboardContext()

    const statusMetrics = statusOrder.map((status) => ({
        status,
        value:
            status === 'Present'
                ? employeeData.present
                : status === 'Absent'
                  ? employeeData.absent
                  : status === 'On Leave'
                    ? employeeData.onLeave
                    : employeeData.remote,
    }))

    const nextEvents = upcomingEvents.slice(0, 3)

    return (
        <div className="mx-auto w-full max-w-full space-y-5">
            <PageIntro
                eyebrow="Analytics"
                title="Workforce Analytics"
                description="A compact view of team availability, remote work, leave, and upcoming operational events."
            />

            {hasError && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p>
                        Some analytics data could not be loaded. The page is
                        showing the safest available values.
                    </p>
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#2457a3]">
                            <Users size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Total Team
                            </p>
                            <p className="text-3xl font-semibold text-slate-950">
                                {isStatsLoading ? '...' : employeeData.total}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <Users size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Available
                            </p>
                            <p className="text-3xl font-semibold text-slate-950">
                                {isStatsLoading ? '...' : employeeData.present}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Monitor size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Remote
                            </p>
                            <p className="text-3xl font-semibold text-slate-950">
                                {isStatsLoading ? '...' : employeeData.remote}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <Clock3 size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                On Leave
                            </p>
                            <p className="text-3xl font-semibold text-slate-950">
                                {isStatsLoading ? '...' : employeeData.onLeave}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                Availability Mix
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-950">
                                Status breakdown
                            </h2>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                            {employeeData.total} people
                        </span>
                    </div>

                    <div className="space-y-4">
                        {statusMetrics.map(({ status, value }) => {
                            const Icon = statusConfig[status].icon
                            const percent = formatPercent(
                                value,
                                employeeData.total,
                            )

                            return (
                                <div key={status}>
                                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                                            <Icon
                                                size={16}
                                                className="text-slate-400"
                                            />
                                            {status}
                                        </div>
                                        <span className="font-semibold text-slate-950">
                                            {value} / {percent}
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full ${statusConfig[status].badgeClassName}`}
                                            style={{
                                                width: isStatsLoading
                                                    ? '18%'
                                                    : percent,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Calendar Signal
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-slate-950">
                            Next events
                        </h2>
                    </div>

                    {isEventsLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-16 animate-pulse rounded-lg bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : nextEvents.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-medium text-slate-500">
                            No upcoming events are scheduled.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {nextEvents.map((event) => (
                                <article
                                    key={event._id}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                >
                                    <p className="font-semibold text-slate-900">
                                        {event.title}
                                    </p>
                                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <CalendarDays
                                            size={15}
                                            className="text-[#2457a3]"
                                        />
                                        {dayjs(event.startDate).isValid()
                                            ? dayjs(event.startDate).format(
                                                  'DD MMM YYYY',
                                              )
                                            : 'Date pending'}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default function About() {
    return (
        <DashboardProvider>
            <AnalyticsContent />
        </DashboardProvider>
    )
}
