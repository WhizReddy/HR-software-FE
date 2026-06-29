import { useDashboardContext } from '../context/hook'
import { statusConfig, statusOrder } from './statusConfig'

const PieChartComponent = () => {
    const { employeeData } = useDashboardContext()
    const total = employeeData.total
    const safeTotal = total || 1
    const metrics = {
        Present: employeeData.present,
        Absent: employeeData.absent,
        'On Leave': employeeData.onLeave,
        Remote: employeeData.remote,
    }

    let currentStop = 0
    const gradientStops = statusOrder
        .map((status) => {
            const nextStop = currentStop + (metrics[status] / safeTotal) * 100
            const stop = `${statusConfig[status].chartColor} ${currentStop.toFixed(1)}% ${nextStop.toFixed(1)}%`
            currentStop = nextStop
            return stop
        })
        .join(', ')

    return (
        <div className="flex h-full w-full animate-fade-in-up flex-col gap-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <div
                    className="relative h-36 w-36 shrink-0 rounded-full shadow-inner"
                    style={{
                        background:
                            total > 0
                                ? `conic-gradient(${gradientStops})`
                                : 'linear-gradient(135deg, rgba(148,163,184,0.2), rgba(226,232,240,0.6))',
                    }}
                >
                    <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white/90 shadow-inner">
                        <span className="text-2xl font-semibold text-slate-950">
                            {total}
                        </span>
                        <span className="mt-0.5 text-[11px] font-semibold uppercase text-slate-500">
                            Team
                        </span>
                    </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-2 text-sm font-medium">
                    {statusOrder.map((status) => {
                        const value = metrics[status]
                        const percentage = (value / safeTotal) * 100

                        return (
                            <div
                                key={status}
                                className="group flex cursor-default items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <div
                                        className={`h-2.5 w-2.5 shrink-0 rounded-full shadow-sm transition-transform group-hover:scale-125 ${statusConfig[status].badgeClassName}`}
                                    />
                                    <span className="truncate text-slate-600 transition-colors group-hover:text-slate-900">
                                        {status}
                                    </span>
                                </div>
                                <span className="shrink-0 text-xs font-semibold text-slate-800">
                                    {value} ({percentage.toFixed(0)}%)
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <p className="text-xs font-medium leading-5 text-slate-500">
                Absent is derived from the remaining headcount after remote and active leave are counted.
            </p>
            {total === 0 && (
                <p className="text-xs font-medium text-slate-400">
                    Status data will appear here once the dashboard endpoints return users.
                </p>
            )}
        </div>
    )
}

export default PieChartComponent
