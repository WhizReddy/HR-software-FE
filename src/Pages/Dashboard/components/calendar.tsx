import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
    DashboardCalendarItem,
    useDashboardContext,
} from '../context/hook'

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const markerStyles: Record<DashboardCalendarItem['kind'], string> = {
    event: 'bg-blue-600',
    vacation: 'bg-emerald-600',
    interview: 'bg-amber-500',
}

const markerLabels: Record<DashboardCalendarItem['kind'], string> = {
    event: 'Events',
    vacation: 'Leave',
    interview: 'Upcoming interviews',
}

const getRangeBounds = (item: DashboardCalendarItem) => {
    const start = dayjs(item.startDate).startOf('day')
    const endCandidate = dayjs(item.endDate).startOf('day')
    const end =
        endCandidate.isValid() && endCandidate.isAfter(start)
            ? endCandidate
            : start

    return { start, end }
}

const itemTouchesMonth = (item: DashboardCalendarItem, month: Dayjs) => {
    const { start, end } = getRangeBounds(item)
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
    const { calendarItems, isCalendarLoading } = useDashboardContext()
    const [visibleMonth, setVisibleMonth] = useState(() => dayjs().startOf('month'))
    const [selectedDate, setSelectedDate] = useState(() => dayjs().startOf('day'))
    const today = dayjs()
    const firstDay = visibleMonth.startOf('month').day()
    const daysInMonth = visibleMonth.daysInMonth()
    const monthStart = visibleMonth.startOf('month')
    const monthEnd = visibleMonth.endOf('month')

    const monthItems = calendarItems.filter((item) =>
        itemTouchesMonth(item, visibleMonth),
    )
    const itemsByDay = monthItems.reduce<Record<number, DashboardCalendarItem[]>>(
        (items, item) => {
            const { start, end } = getRangeBounds(item)
            let cursor = start.isBefore(monthStart, 'day') ? monthStart : start
            const rangeEnd = end.isAfter(monthEnd, 'day') ? monthEnd : end

            while (!cursor.isAfter(rangeEnd, 'day')) {
                const dayOfMonth = cursor.date()
                items[dayOfMonth] = [...(items[dayOfMonth] ?? []), item]
                cursor = cursor.add(1, 'day')
            }

            return items
        },
        {},
    )
    const monthCounts = monthItems.reduce<
        Record<DashboardCalendarItem['kind'], number>
    >(
        (counts, item) => ({
            ...counts,
            [item.kind]: counts[item.kind] + 1,
        }),
        { event: 0, vacation: 0, interview: 0 },
    )
    const selectedDayItems = selectedDate.isSame(visibleMonth, 'month')
        ? (itemsByDay[selectedDate.date()] ?? [])
        : []

    const moveVisibleMonth = (direction: 'previous' | 'next') => {
        const nextMonth =
            direction === 'previous'
                ? visibleMonth.subtract(1, 'month')
                : visibleMonth.add(1, 'month')

        setVisibleMonth(nextMonth)
        setSelectedDate((currentSelectedDate) =>
            currentSelectedDate.isSame(nextMonth, 'month')
                ? currentSelectedDate
                : nextMonth.startOf('month'),
        )
    }

    return (
        <div className="w-full">
            <div className="mb-5 flex items-center justify-between gap-3 px-1">
                <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                        {visibleMonth.format('MMMM YYYY')}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase text-slate-400">
                        {isCalendarLoading
                            ? 'Loading calendar'
                            : `${monthItems.length} item${monthItems.length === 1 ? '' : 's'} this month`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => moveVisibleMonth('previous')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => moveVisibleMonth('next')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                        aria-label="Next month"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
            <div className="mb-3 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase text-slate-400">
                {weekDays.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-x-1 gap-y-2 text-center text-sm">
                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-10 rounded-lg" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const date = index + 1
                    const isToday =
                        visibleMonth.isSame(today, 'month') && date === today.date()
                    const dayItems = itemsByDay[date] ?? []
                    const visibleMarkers = Array.from(
                        new Set(dayItems.map((item) => item.kind)),
                    ).slice(0, 3)

                    return (
                        <button
                            type="button"
                            key={date}
                            onClick={() =>
                                setSelectedDate(visibleMonth.date(date).startOf('day'))
                            }
                            className={`relative mx-auto flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors ${
                                isToday
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : selectedDate.isSame(
                                            visibleMonth.date(date),
                                            'day',
                                        )
                                      ? 'bg-slate-900 text-white'
                                    : dayItems.length > 0
                                      ? 'bg-slate-100 text-slate-700'
                                      : 'text-slate-700 hover:bg-slate-100'
                            }`}
                            aria-label={`${visibleMonth.date(date).format('MMMM D')}, ${dayItems.length} calendar item${dayItems.length === 1 ? '' : 's'}`}
                        >
                            {date}
                            {visibleMarkers.length > 0 && (
                                <span className="absolute -bottom-1 flex gap-0.5">
                                    {visibleMarkers.map((kind) => (
                                        <span
                                            key={kind}
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                isToday
                                                    ? 'bg-white'
                                                    : markerStyles[kind]
                                            }`}
                                        />
                                    ))}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50/70 p-4 text-left">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            {selectedDate.format('DD MMM YYYY')}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                            {selectedDayItems.length} calendar item
                            {selectedDayItems.length === 1 ? '' : 's'}
                        </p>
                    </div>
                </div>
                {selectedDayItems.length > 0 ? (
                    <ul className="space-y-2">
                        {selectedDayItems.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-start gap-2 rounded-md bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                            >
                                <span
                                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${markerStyles[item.kind]}`}
                                />
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900">
                                        {item.title}
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                                        {markerLabels[item.kind]}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                        No calendar items for this day.
                    </p>
                )}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                {Object.entries(markerLabels).map(([kind, label]) => (
                    <span key={kind} className="inline-flex items-center gap-1.5">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                markerStyles[
                                    kind as DashboardCalendarItem['kind']
                                ]
                            }`}
                        />
                        {label}:{' '}
                        {
                            monthCounts[
                                kind as DashboardCalendarItem['kind']
                            ]
                        }
                    </span>
                ))}
            </div>
        </div>
    )
}
