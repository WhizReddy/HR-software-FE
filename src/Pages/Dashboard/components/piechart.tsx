import { useDashboardContext } from '../context/hook'

const PieChartComponent = () => {
    const { employeeData } = useDashboardContext()
    const total = employeeData.present + employeeData.absent + employeeData.onLeave + employeeData.remote
    const safe = total || 1 // avoid div by zero

    const presentPct = (employeeData.present / safe) * 100
    const absentPct = (employeeData.absent / safe) * 100
    const onLeavePct = (employeeData.onLeave / safe) * 100
    const remotePct = (employeeData.remote / safe) * 100

    const p1 = presentPct
    const p2 = p1 + absentPct
    const p3 = p2 + onLeavePct

    return (
        <div className="flex flex-col items-center justify-center p-2 w-full h-full animate-fade-in-up">
            <div className="relative w-48 h-48 rounded-full mb-8 shadow-inner" style={{
                background: `conic-gradient(
                    #3b82f6 0% ${p1.toFixed(1)}%,
                    #ef4444 ${p1.toFixed(1)}% ${p2.toFixed(1)}%,
                    #f59e0b ${p2.toFixed(1)}% ${p3.toFixed(1)}%,
                    #10b981 ${p3.toFixed(1)}% 100%
                )`
            }}>
                {/* Inner cutout for donut chart effect */}
                <div className="absolute inset-4 bg-white/80 backdrop-blur-md rounded-full shadow-inner flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-slate-800">{total}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Total</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium w-full max-w-xs px-2">
                <div className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0 shadow-sm group-hover:scale-125 transition-transform"></div>
                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Present</span>
                    </div>
                    <span className="font-bold text-slate-800">{presentPct.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full shrink-0 shadow-sm group-hover:scale-125 transition-transform"></div>
                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Absent</span>
                    </div>
                    <span className="font-bold text-slate-800">{absentPct.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shrink-0 shadow-sm group-hover:scale-125 transition-transform"></div>
                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Leave</span>
                    </div>
                    <span className="font-bold text-slate-800">{onLeavePct.toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shrink-0 shadow-sm group-hover:scale-125 transition-transform"></div>
                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Remote</span>
                    </div>
                    <span className="font-bold text-slate-800">{remotePct.toFixed(0)}%</span>
                </div>
            </div>
        </div>
    )
}

export default PieChartComponent
