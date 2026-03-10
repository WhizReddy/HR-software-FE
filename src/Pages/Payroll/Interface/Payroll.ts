import { ColDef, PaginationModel, RowParams } from '@/types/table'
import React from 'react'

export interface PayrollContextType {
    rows: PayrollRow[]
    columns: ColDef<PayrollRow>[]
    handleRowClick: (params: RowParams<PayrollRow>) => void
    getRowId: (row: PayrollRow) => number
    setMonth: (month: number | undefined) => void
    setName: (name: string) => void
    setYear: (year: number | undefined) => void
    setNetSalary: (netSalary: number | undefined) => void
    setFullName: (fullName: string) => void
    setWorkingDays: (workingDays: number | undefined) => void
    setMaxNetSalary: (maxNetSalary: number | undefined) => void
    setMinNetSalary: (maxNetSalary: number | undefined) => void
    setBonus: (bonus: number | undefined) => void
    isPending: boolean
    netSalary: number | undefined
    page: number
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string | boolean>>>
    filters: Record<string, string | boolean>
    pageSize: number
    totalPages: number
    handlePaginationModelChange: (paginationModel: PaginationModel) => void
}

export const PayrollContext = React.createContext<PayrollContextType | undefined>(undefined)

export interface PayrollRow {
    id: number
    originalId: string
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
