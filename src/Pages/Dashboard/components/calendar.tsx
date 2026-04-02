import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EventsData } from '../../Events/Interface/Events'
import { useDashboardContext } from '../context/hook'

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const getRangeBounds = (event: EventsData) => {
    const start = dayjs(event.startDate).startOf('day')
    const endCandidate = dayjs(event.endDate).startOf('day')
    const end =
        endCandidate.isValid() && endCandidate.isAfter(start)
            ? endCandidate
            : start

    return { start, end }
}

const eventTouchesMonth = (event: EventsData, month: Dayjs) => {
    const { start, end } = getRangeBounds(event)
    const monthStart = month.startOf('month')
    const monthEnd = month.endOf('month')

    return (
        start.isValid() &&
        end.isValid() &&
        !end.isBefore(monthStart, 'day') &&
        !start.isAfter(monthEnd, 'day')
    )
}

export default function Calendar() {
    const { events, isEventsLoading } = useDashboardContext()
    const [visibleMonth, setVisibleMonth] = useState(() => dayjs().startOf('month'))
    const today = dayjs()
    const firstDay = visibleMonth.startOf('month').day()
    const daysInMonth = visibleMonth.daysInMonth()
    const monthStart = visibleMonth.startOf('month')
    const monthEnd = visibleMonth.endOf('month')

    const monthEvents = events.filter((event) => eventTouchesMonth(event, visibleMonth))
    const eventCountsByDay = monthEvents.reduce<Record<number, number>>(
        (counts, event) => {
            const { start, end } = getRangeBounds(event)
            let cursor = start.isBefore(monthStart, 'day') ? monthStart : start
            const rangeEnd = end.isAfter(monthEnd, 'day') ? monthEnd : end

            while (!cursor.isAfter(rangeEnd, 'day')) {
                const dayOfMonth = cursor.date()
                counts[dayOfMonth] = (counts[dayOfMonth] ?? 0) + 1
                cursor = cursor.add(1, 'day')
            }

            return counts
        },
        {},
    )

    return (
        <div className="w-full">
            <div className="mb-5 flex items-center justify-between gap-3 px-1">
                <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-800">
                        {visibleMonth.format('MMMM YYYY')}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                        {isEventsLoading
                            ? 'Loading events'
                            : `${monthEvents.length} event${monthEvents.length === 1 ? '' : 's'} this month`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setVisibleMonth((currentMonth) => currentMonth.subtract(1, 'month'))}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setVisibleMonth((currentMonth) => currentMonth.add(1, 'month'))}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                        aria-label="Next month"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
                {weekDays.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center text-sm">
                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-10 rounded-2xl" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = index + 1
                    const isToday =
                        visibleMonth.isSame(today, 'month') && date === today.date()
                    const eventCount = eventCountsByDay[date] ?? 0

                    return (
                        <div
                            key={date}
                            className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-2xl font-medium transition-colors ${
                                isToday
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : eventCount > 0
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            {date}
                            {eventCount > 0 && (
                                <span
                                    className={`absolute -bottom-1 inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                        isToday
                                            ? 'bg-white text-blue-700'
                                            : 'bg-blue-600 text-white'
                                    }`}
                                >
                                    {eventCount}
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">
                {monthEvents.length > 0
                    ? 'Numbers show how many event days fall on each date.'
                    : 'No events are scheduled for this month.'}
            </p>
        </div>
    )
}
