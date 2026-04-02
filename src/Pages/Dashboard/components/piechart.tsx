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
        <div className="flex h-full w-full animate-fade-in-up flex-col items-center justify-center p-2">
            <div
                className="relative mb-8 h-48 w-48 rounded-full shadow-inner"
                style={{
                    background:
                        total > 0
                            ? `conic-gradient(${gradientStops})`
                            : 'linear-gradient(135deg, rgba(148,163,184,0.2), rgba(226,232,240,0.6))',
                }}
            >
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-white/80 shadow-inner backdrop-blur-md">
                    <span className="text-3xl font-extrabold text-slate-800">{total}</span>
                    <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Team Size
                    </span>
                </div>
            </div>
            <div className="grid w-full max-w-xs grid-cols-2 gap-x-6 gap-y-3 px-2 text-sm font-medium">
                {statusOrder.map((status) => {
                    const value = metrics[status]
                    const percentage = (value / safeTotal) * 100

                    return (
                        <div
                            key={status}
                            className="group flex cursor-default items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-3 w-3 shrink-0 rounded-full shadow-sm transition-transform group-hover:scale-125 ${statusConfig[status].badgeClassName}`}
                                />
                                <span className="text-slate-600 transition-colors group-hover:text-slate-900">
                                    {status}
                                </span>
                            </div>
                            <span className="font-bold text-slate-800">
                                {value} ({percentage.toFixed(0)}%)
                            </span>
                        </div>
                    )
                })}
            </div>
            <p className="mt-5 max-w-sm text-center text-xs font-medium leading-5 text-slate-500">
                Absent is derived from the remaining headcount after remote and active leave are counted.
            </p>
            {total === 0 && (
                <p className="mt-2 text-center text-xs font-medium text-slate-400">
                    Status data will appear here once the dashboard endpoints return users.
                </p>
            )}
        </div>
    )
}

export default PieChartComponent
