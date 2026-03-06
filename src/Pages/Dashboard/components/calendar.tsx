import React from 'react'
import dayjs from 'dayjs'

export default function Calendar() {
    const today = dayjs()
    const daysInMonth = today.daysInMonth()
    const firstDay = today.startOf('month').day()
    const highlightedDays = [1, 2, 15]

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6 px-1">
                <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">{today.format('MMMM YYYY')}</h3>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3 font-medium text-slate-400 uppercase tracking-wider">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const date = i + 1
                    const isHighlighted = highlightedDays.includes(date)
                    const isToday = date === today.date()

                    return (
                        <div
                            key={date}
                            className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-colors relative
                                ${isToday ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-200' : 'hover:bg-slate-100 text-slate-700 font-medium'}
                            `}
                        >
                            {date}
                            {isHighlighted && !isToday && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                            </span>}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
