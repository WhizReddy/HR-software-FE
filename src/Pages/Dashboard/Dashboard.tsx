import React from 'react'
import { useAuth } from '@/Context/AuthProvider.tsx'
import Calendar from './components/calendar.tsx'
import CardInfo from './components/card.tsx'
import InfoSection from './components/infoSection.tsx'
import PieChartComponent from './components/piechart.tsx'
import { DashboardProvider, useDashboardContext } from './context/hook.tsx'
import { greeter } from '@/Helpers/Greeter.tsx'
import { UserProfileData } from '../Employees/interfaces/Employe.ts'
import { useQuery } from '@tanstack/react-query'
import AxiosInstance from '@/Helpers/Axios.tsx'
import { useNavigate } from 'react-router-dom'

const DashboardContent: React.FC = () => {
    const { employeeData } = useDashboardContext()
    const { currentUser } = useAuth()
    const navigate = useNavigate()

    const userName = currentUser ? currentUser.firstName : 'User'
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'

    const { data: UserProfileDataList } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await AxiosInstance.get('/user')
            return response.data
        },
    })

    return (
        <div className="mx-auto max-w-[1400px] space-y-6">
            {/* Greeting */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        {greeter()}, <span className="text-[#2457a3]">{userName}</span> 👋
                    </h1>
                    {isAdmin && (
                        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your team today.</p>
                    )}
                </div>
            </div>

            {/* Stat cards — using inline grid for reliability */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <CardInfo title="Present" content={employeeData.present.toString()} icon="Present" />
                <CardInfo title="Absent" content={employeeData.absent.toString()} icon="Absent" />
                <CardInfo title="On Leave" content={employeeData.onLeave.toString()} icon="On Leave" />
                <CardInfo title="Remote" content={employeeData.remote.toString()} icon="Remote" />
            </div>

            {/* Main row: Calendar + InfoSection + PieChart */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                {/* Calendar */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-3">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Calendar</h3>
                    <Calendar />
                </div>

                {/* Info Section */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-5">
                    <InfoSection />
                </div>

                {/* Pie Chart */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Employee Status</h3>
                    <PieChartComponent />
                </div>
            </div>

            {/* Team directory */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-5">Team Directory</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
                    {UserProfileDataList?.map((employee: UserProfileData) => (
                        <div
                            key={employee._id}
                            className="flex flex-col items-center gap-2 group cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            onClick={() => navigate(`/profile/${employee._id}`)}
                        >
                            <div className="relative w-14 h-14">
                                {employee.imageUrl ? (
                                    <img
                                        src={employee.imageUrl}
                                        alt={`${employee.firstName} ${employee.lastName}`}
                                        className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-[#2457a3] transition-all"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2457a3] to-[#4A7BCD] flex items-center justify-center text-white font-bold text-lg ring-2 ring-slate-100 group-hover:ring-[#2457a3] transition-all">
                                        {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                    </div>
                                )}
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-700 group-hover:text-[#2457a3] transition-colors leading-tight">
                                    {employee.firstName} {employee.lastName}
                                </p>
                                <p className="text-[10px] text-slate-400 capitalize mt-0.5">{(employee as any).role ?? ''}</p>
                            </div>
                        </div>
                    ))}
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
