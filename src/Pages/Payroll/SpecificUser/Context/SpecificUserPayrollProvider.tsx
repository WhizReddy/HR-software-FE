import React, { useEffect, useState } from 'react'
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
    const [employeeName, setEmployeeName] = useState('')

    const applyFilterChange = <T,>(
        setter: React.Dispatch<React.SetStateAction<T>>,
        value: T,
    ) => {
        setPage(0)
        setter(value)
    }

    const handlePaginationModelChange = (model: PaginationModel) => {
        setPage(model.page)
        setPageSize(model.pageSize)
    }

    const fetchPayroll = async (): Promise<{
        data: PayrollRowSpecifc[]
        totalPages: number
        all: number
    }> => {
        const params = new URLSearchParams({
            limit: String(pageSize),
            page: String(page),
        })

        if (month !== undefined) {
            params.set('month', String(month))
        }

        if (year !== undefined) {
            params.set('year', String(year))
        }

        const response = await AxiosInstance.get<{
            data: PayrollRowSpecifc[]
            totalPages: number
            all: number
        }>(`/salary/user/${id}?${params.toString()}`)
        return response.data
    }

    const { data: payrollId, isPending, isError, error } = useQuery<
        { data: PayrollRowSpecifc[]; totalPages: number; all: number },
        Error
    >({
        queryKey: ['payrollId', id, month, year, page, pageSize],
        queryFn: () => fetchPayroll(),
        enabled: Boolean(id),
        placeholderData: (previousData) => previousData,
    })

    useEffect(() => {
        const user = payrollId?.data[0]?.userId

        if (user) {
            setEmployeeName(`${user.firstName} ${user.lastName}`)
        }
    }, [payrollId])

    const rows: PayrollRowSpecifc[] =
        payrollId?.data.map((payrollData, index) => ({
            id: page * pageSize + index + 1,
            originalId: payrollData.userId?._id ?? '',
            netSalary: `${payrollData.netSalary} ${payrollData.currency}`,
            healthInsurance: `${payrollData.healthInsurance} ${payrollData.currency}`,
            month: getMonthName(Number(payrollData.month)),
            workingDays: payrollData.workingDays,
            socialSecurity: payrollData.socialSecurity,
            tax: payrollData.tax,
            fullName: payrollData.userId
                ? `${payrollData.userId.firstName} ${payrollData.userId.lastName}`
                : 'Unknown user',
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
        setMonth: (value: number | undefined) => applyFilterChange(setMonth, value),
        setYear: (value: number | undefined) => applyFilterChange(setYear, value),
        isPending,
        isError,
        errorMessage: error?.message || null,
        page,
        pageSize,
        totalPages: payrollId?.totalPages ?? 0,
        totalCount: payrollId?.all ?? rows.length,
        handlePaginationModelChange,
        fullName: employeeName,
    }

    return (
        <PayrollContextSpecific.Provider value={contextValue}>
            {children}
        </PayrollContextSpecific.Provider>
    )
}
