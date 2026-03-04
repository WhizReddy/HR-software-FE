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
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-48 h-48 rounded-full mb-6" style={{
                background: `conic-gradient(
                    #3b82f6 0% ${p1.toFixed(1)}%,
                    #ef4444 ${p1.toFixed(1)}% ${p2.toFixed(1)}%,
                    #f59e0b ${p2.toFixed(1)}% ${p3.toFixed(1)}%,
                    #10b981 ${p3.toFixed(1)}% 100%
                )`
            }}></div>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium w-full max-w-xs">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></div><span className="text-slate-700">Present ({presentPct.toFixed(0)}%)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full shrink-0"></div><span className="text-slate-700">Absent ({absentPct.toFixed(0)}%)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full shrink-0"></div><span className="text-slate-700">On Leave ({onLeavePct.toFixed(0)}%)</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full shrink-0"></div><span className="text-slate-700">Remote ({remotePct.toFixed(0)}%)</span></div>
            </div>
        </div>
    )
}

export default PieChartComponent
