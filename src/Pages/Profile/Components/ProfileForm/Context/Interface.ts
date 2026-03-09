import React, { createContext } from 'react'
import { UserProfileData } from '../../../../Employees/interfaces/Employe'

export interface ProfileContextType {
    user: UserProfileData | null
    error: string | null
    isLoading: boolean
    isCurrentUser: boolean
    isAdmin: boolean
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleUpdate: (event: React.FormEvent<HTMLButtonElement>) => Promise<void>
    toastOpen: boolean
    toastMessage: string
    toastSeverity: 'success' | 'error'
    handleToastClose: () => void
    handleCreateToastClose: () => void
    handleUpdatePayroll: (
        event: React.FormEvent<HTMLButtonElement>,
    ) => Promise<void>
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
    undefined,
)

export interface EmployeePayroll {
    _id: string
    workingDays: number | undefined
    grossSalary: number | undefined
    bonus: number | undefined
    bonusDescription: string
    extraHours: number | undefined
    month: number
    year: number
    userId: string
}

export interface EmployePayroll {
    workingDays: number | undefined
    grossSalary: number | undefined
    bonus: number | undefined
    bonusDescription: string
    extraHours: number | undefined
    userId: string
}
