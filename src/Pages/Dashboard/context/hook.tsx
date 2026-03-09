import React, { createContext, useState, useContext, useEffect } from 'react'
import AxiosInstance from '@/Helpers/Axios'

interface DashboardContextType {
    employeeData: {
        present: number
        absent: number
        onLeave: number
        remote: number
    }
    updateEmployeeData: (
        data: Partial<DashboardContextType['employeeData']>,
    ) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined,
)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [employeeData, setEmployeeData] = useState({
        present: 0,
        absent: 0,
        onLeave: 0,
        remote: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch present (office), remote, total, and on-leave counts
                const [presentRes, remoteRes, allRes, onLeaveRes] = await Promise.all([
                    AxiosInstance.get<number>('/user/remote/false'),  // present (not remote)
                    AxiosInstance.get<number>('/user/remote/true'),   // remote
                    AxiosInstance.get<any[]>('/user'),                // all users for totals
                    AxiosInstance.get<number>('/vacation/onLeave'),   // users currently on leave
                ])

                const present = typeof presentRes.data === 'number' ? presentRes.data : 0
                const remote = typeof remoteRes.data === 'number' ? remoteRes.data : 0
                const allUsers = Array.isArray(allRes.data) ? allRes.data.length : 0
                const onLeave = typeof onLeaveRes.data === 'number' ? onLeaveRes.data : 0

                // Approximate absent as remaining (total - present - remote - onLeave)
                const known = present + remote + onLeave
                const absent = Math.max(0, allUsers - known)

                setEmployeeData({
                    present,
                    remote,
                    absent,
                    onLeave,
                })
            } catch {
                // Keep defaults on error — data is not critical
            }
        }
        fetchStats()
    }, [])

    const updateEmployeeData = (
        data: Partial<DashboardContextType['employeeData']>,
    ) => {
        setEmployeeData((prevData) => ({ ...prevData, ...data }))
    }

    return (
        <DashboardContext.Provider value={{ employeeData, updateEmployeeData }}>
            {children}
        </DashboardContext.Provider>
    )
}

export const useDashboardContext = () => {
    const context = useContext(DashboardContext)
    if (context === undefined) {
        throw new Error(
            'useDashboardContext must be used within a DashboardProvider',
        )
    }
    return context
}
