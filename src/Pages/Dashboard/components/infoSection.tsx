import dayjs from 'dayjs'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'
import { useDashboardContext } from '../context/hook'

const getTimelineLabel = (startDate: string, endDate: string) => {
    const today = dayjs().startOf('day')
    const start = dayjs(startDate).startOf('day')
    const endCandidate = dayjs(endDate).startOf('day')
    const end =
        endCandidate.isValid() && endCandidate.isAfter(start)
            ? endCandidate
            : start

    if (!start.isValid()) {
        return 'Date pending'
    }

    if (!today.isBefore(start, 'day') && !today.isAfter(end, 'day')) {
        return 'Happening now'
    }

    const daysUntil = start.diff(today, 'day')
    if (daysUntil <= 0) {
        return 'Starts today'
    }

    if (daysUntil === 1) {
        return 'Tomorrow'
    }

    return `In ${daysUntil} days`
}

const InfoSection: React.FC = () => {
    const { upcomingEvents, isEventsLoading } = useDashboardContext()
    const visibleEvents = upcomingEvents.slice(0, 4)

    return (
        <div className="flex h-full flex-col">
            <div className="mb-5">
                <h2 className="text-base font-bold tracking-tight text-slate-800">
                    Upcoming Events
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                    Next scheduled items, sorted by the nearest start date.
                </p>
            </div>

            {isEventsLoading ? (
                <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                    Loading upcoming events...
                </div>
            ) : visibleEvents.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center text-sm font-medium text-slate-400">
                    No upcoming events are scheduled right now.
                </div>
            ) : (
                <ul className="custom-scrollbar m-0 flex-1 list-none space-y-3 overflow-y-auto p-0 pr-2">
                    {visibleEvents.map((event) => (
                        <li
                            key={event._id}
                            className="group rounded-2xl border border-transparent bg-white/60 px-4 py-4 transition-all duration-300 hover:border-slate-100 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-500">
                                        {getTimelineLabel(event.startDate, event.endDate)}
                                    </p>
                                    <h3 className="mt-1 text-[15px] font-semibold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
                                        {event.title}
                                    </h3>
                                </div>
                                {event.photo?.[0] && (
                                    <img
                                        src={event.photo[0]}
                                        alt={event.title}
                                        className="h-12 w-12 flex-shrink-0 rounded-xl object-cover shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                                    />
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={14} className="text-blue-500" />
                                    {dayjs(event.startDate).isValid()
                                        ? dayjs(event.startDate).format('ddd DD MMM YYYY')
                                        : 'Date pending'}
                                </span>
                                {event.time && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock3 size={14} className="text-blue-500" />
                                        {event.time}
                                    </span>
                                )}
                                {event.location && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={14} className="text-blue-500" />
                                        {event.location}
                                    </span>
                                )}
                            </div>

                            {event.description && (
                                <p className="mt-3 line-clamp-2 text-sm font-medium text-slate-500">
                                    {event.description}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default InfoSection
