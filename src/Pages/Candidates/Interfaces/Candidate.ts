import React from 'react'
import { ColDef, PaginationModel, RowParams } from '@/types/table'

export interface CandidateRow {
    _id: string
    firstName: string
    lastName: string
    id: number
    originalId: string | number
    fullName: string
    phoneNumber: string
    email: string
    experience: string
    applicationMethod: string
    age: string
    positionApplied: string
    technologiesUsed: string[]
    salaryExpectations: string
    status: string
}

export interface applicantsData {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    experience: string
    applicationMethod: string
    age: string
    positionApplied: string
    technologiesUsed: string[]
    salaryExpectations: string
    status: string
    _id: number
}

export interface CandidateContextType {
    rows: CandidateRow[]
    columns: ColDef<CandidateRow>[]
    getRowId: (row: CandidateRow) => number
    handleRowClick: (params: RowParams<CandidateRow>) => void
    isPending: boolean
    page: number
    pageSize: number
    totalPages: number
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
    clearSearch: () => void
    handlePaginationModelChange: (paginationModel: PaginationModel) => void
}

export const CandidateContext = React.createContext<
    CandidateContextType | undefined
>(undefined)
