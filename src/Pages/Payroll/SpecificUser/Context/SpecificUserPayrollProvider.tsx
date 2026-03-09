import React, { useState } from 'react'
import { PayrollContextSpecific, PayrollRowSpecifc } from '../interface'
import { PaginationModel } from '@/types/table'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getMonthName } from '../../utils/Utils'

export const PayrollProviderSpecific: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { id } = useParams()
    const [month, setMonth] = useState<number | undefined>(undefined)
    const [year, setYear] = useState<number | undefined>(undefined)
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)

    const handlePaginationModelChange = (model: PaginationModel) => {
        setPage(model.page)
        setPageSize(model.pageSize)
    }

    const fetchPayroll = async (): Promise<{
        data: PayrollRowSpecifc[]
        totalPages: number
    }> => {
        const response = await AxiosInstance.get<{
            data: PayrollRowSpecifc[]
            totalPages: number
        }>(
            `/salary/user/${id}?month=${month}&year=${year}&limit=${pageSize}&page=${page}`,
        )
        return response.data
    }

    const { data: payrollId, isPending } = useQuery<
        { data: PayrollRowSpecifc[]; totalPages: number },
        Error
    >({
        queryKey: ['payrollId', month, year, page, pageSize],
        queryFn: () => fetchPayroll(),
    })

    const rows: PayrollRowSpecifc[] =
        payrollId?.data.map((payrollData, index) => ({
            id: page * pageSize + index + 1,
            originalId: payrollData.userId._id,
            netSalary: `${payrollData.netSalary}${payrollData.currency}`,
            healthInsurance: `${payrollData.healthInsurance}${payrollData.currency}`,
            month: getMonthName(Number(payrollData.month)),
            workingDays: payrollData.workingDays,
            socialSecurity: payrollData.socialSecurity,
            tax: payrollData.tax,
            fullName: `${payrollData.userId.firstName} ${payrollData.userId.lastName}`,
            grossSalary: payrollData.grossSalary,
            year: payrollData.year,
            bonusDescription: payrollData.bonusDescription,
            currency: payrollData.currency,
            bonus: payrollData.bonus,
            userId: payrollData.userId,
        })) ?? []

    const columns = [
        { field: 'id', headerName: 'No', flex: 0.5 },
        { field: 'fullName', headerName: 'Full Name', flex: 1.7 },
        { field: 'netSalary', headerName: 'Net Salary', flex: 1.7 },
        { field: 'healthInsurance', headerName: 'Health Insurance', flex: 1.7 },
        { field: 'socialSecurity', headerName: 'Social Security', flex: 1.7 },
        { field: 'tax', headerName: 'Tax', flex: 1.5 },
        { field: 'month', headerName: 'Month', flex: 1 },
        { field: 'workingDays', headerName: 'Working Days', flex: 1.5 },
        { field: 'grossSalary', headerName: 'Gross Salary', flex: 1.5 },
        { field: 'year', headerName: 'Year', flex: 1 },
        { field: 'bonus', headerName: 'Bonus', flex: 1.2 },
        { field: 'bonusDescription', headerName: 'Bonus Description', flex: 2 },
    ]

    const headerTextColors = { firstName: '#0000FF' }

    const getRowId = (row: PayrollRowSpecifc) => row.id

    const contextValue = {
        rows,
        columns,
        headerTextColors,
        getRowId,
        setMonth,
        setYear,
        isPending,
        page,
        pageSize,
        totalPages: payrollId?.totalPages ?? 0,
        handlePaginationModelChange,
        fullName: payrollId?.data[0]
            ? `${payrollId.data[0].userId.firstName} ${payrollId.data[0].userId.lastName}`
            : '',
    }

    return (
        <PayrollContextSpecific.Provider value={contextValue}>
            {children}
        </PayrollContextSpecific.Provider>
    )
}
