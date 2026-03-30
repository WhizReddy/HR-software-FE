import React from 'react'
import { ColDef, PaginationModel, RowParams } from '@/types/table'

export interface EmployeeRow {
    imageUrl: string | undefined
    id: number
    originalId: number
    role: string
    phone: string
    email: string
    fullName: string
}

export interface EmployeeContextType {
    rows: EmployeeRow[]
    columns: ColDef<EmployeeRow>[]
    isPending: boolean
    getRowId: (row: EmployeeRow) => number
    handleRowClick: (params: RowParams<EmployeeRow>) => void
    page: number
    pageSize: number
    totalPages: number
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    clearSearch: () => void
    handlePaginationModelChange: (paginationModel: PaginationModel) => void
}

export interface UserProfileData {
    auth: {
        email: string
    }
    lastName: string
    phone: string
    pob: string
    dob: string
    gender: string
    originalId: number
    role: string
    firstName: string
    imageUrl: string
    file: string
    _id: number
}

export const EmployeeContext = React.createContext<
    EmployeeContextType | undefined
>(undefined)
