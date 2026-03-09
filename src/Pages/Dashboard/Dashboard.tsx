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
        <div className="relative overflow-x-hidden">
            <div className="relative mx-auto max-w-[1400px] space-y-8 p-4 sm:p-6 lg:p-8 z-10">
                {/* Greeting */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {greeter()}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{userName}</span> 👋
                        </h1>
                        {isAdmin && (
                            <p className="text-slate-500 font-medium mt-2">Here's what's happening with your team today.</p>
                        )}
                    </div>
                </div>

                {/* Main Bento Grid layout */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 auto-rows-min">

                    {/* Stat cards - Spanning top section */}
                    <div className="xl:col-span-12 w-full">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
                            <CardInfo title="Present" content={employeeData.present.toString()} icon="Present" />
                            <CardInfo title="Absent" content={employeeData.absent.toString()} icon="Absent" />
                            <CardInfo title="On Leave" content={employeeData.onLeave.toString()} icon="On Leave" />
                            <CardInfo title="Remote" content={employeeData.remote.toString()} icon="Remote" />
                        </div>
                    </div>

                    {/* Left Column: Calendar (Bento tile) */}
                    <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-4 h-full flex flex-col">
                        <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Calendar</h3>
                        <div className="flex-1">
                            <Calendar />
                        </div>
                    </div>

                    {/* Middle Column: Info Section (Events) */}
                    <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-4 min-h-[500px] flex flex-col">
                        <InfoSection />
                    </div>

                    {/* Right Column: Pie Chart */}
                    <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-4 min-h-[500px] flex flex-col">
                        <h3 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Status Overview</h3>
                        <div className="flex-1 flex items-center justify-center">
                            <PieChartComponent />
                        </div>
                    </div>

                    {/* Team directory spanning bottom row */}
                    <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-xl p-6 shadow-xl shadow-slate-200/40 xl:col-span-12">
                        <h3 className="text-base font-bold text-slate-800 mb-6 tracking-tight">Team Directory</h3>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                            {UserProfileDataList?.map((employee: UserProfileData) => (
                                <div
                                    key={employee._id}
                                    className="flex flex-col items-center gap-3 group cursor-pointer p-3 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                    onClick={() => navigate(`/profile/${employee._id}`)}
                                >
                                    <div className="relative w-16 h-16">
                                        {employee.imageUrl ? (
                                            <img
                                                src={employee.imageUrl}
                                                alt={`${employee.firstName} ${employee.lastName}`}
                                                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-sm group-hover:ring-blue-100 transition-all duration-300"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl ring-4 ring-white shadow-sm group-hover:ring-blue-100 transition-all duration-300">
                                                {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                                            </div>
                                        )}
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                                    </div>
                                    <div className="text-center w-full px-1">
                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight truncate">
                                            {employee.firstName} {employee.lastName}
                                        </p>
                                        <p className="text-xs font-medium text-slate-500 capitalize mt-1 truncate">
                                            {(employee as any).role ?? 'Employee'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
