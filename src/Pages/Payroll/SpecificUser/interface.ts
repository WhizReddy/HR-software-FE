import { ColDef, PaginationModel } from '@/types/table'
import React from 'react'

export interface PayrollContextType {
    rows: PayrollRowSpecifc[]
    columns: ColDef<PayrollRowSpecifc>[]
    headerTextColors: { [key: string]: string }
    getRowId: (row: PayrollRowSpecifc) => number
    setMonth: (month: number | undefined) => void
    setYear: (year: number | undefined) => void
    fullName: string | undefined
    isPending: boolean
    page: number
    pageSize: number
    totalPages: number
    handlePaginationModelChange: (paginationModel: PaginationModel) => void
}

export const PayrollContextSpecific = React.createContext<
    PayrollContextType | undefined
>(undefined)

export interface PayrollRowSpecifc {
    id: number
    originalId: string | number
    netSalary: number | string
    workingDays: number
    currency: string
    bonus: number
    bonusDescription: string
    socialSecurity: number
    healthInsurance: number | string
    grossSalary: number
    month: number | string
    year: number
    tax: number
    userId: {
        _id: string
        firstName: string
        lastName: string
    }
}

export interface UserPayrolls {
    id: number
    originalId: number
    netSalary: number
    workingDays: number
    currency: string
    bonus: number
    bonusDescription: string
    socialSecurity: number
    healthInsurance: number
    grossSalary: number
    month: number
    year: number
    userId: {
        firstName: string
        lastName: string
        _id: string
    }
}
