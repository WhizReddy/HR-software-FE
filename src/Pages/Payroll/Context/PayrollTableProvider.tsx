import React, { useState } from 'react'
import { PayrollContext, PayrollRow } from '../Interface/Payroll'
import { PaginationModel } from '@/types/table'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { getMonthName } from '../utils/Utils'

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [month, setMonth] = useState<number | undefined>(undefined)
    const [year, setYear] = useState<number | undefined>(undefined)
    const [fullName, setFullName] = useState('')
    const [bonus, setBonus] = useState<number | undefined>(undefined)
    const [minNetSalary, setMinNetSalary] = useState<number | undefined>(undefined)
    const [maxNetSalary, setMaxNetSalary] = useState<number | undefined>(undefined)
    const [workingDays, setWorkingDays] = useState<number | undefined>(undefined)
    const [netSalary, setNetSalary] = useState<number | undefined>(undefined)
    const [filters, setFilters] = useState<Record<string, string | boolean>>({})
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)

    const handlePaginationModelChange = (model: PaginationModel) => {
        setPage(model.page)
        setPageSize(model.pageSize)
    }

    const navigate = useNavigate()

    const fetchPayroll = async (): Promise<{
        data: PayrollRow[]
        totalPages: number
    }> => {
        // Build URL without undefined params — prevents "No data to display" bug
        const params = new URLSearchParams()
        params.set('limit', String(pageSize))
        params.set('page', String(page))
        if (month !== undefined) params.set('month', String(month))
        if (year !== undefined) params.set('year', String(year))
        if (bonus !== undefined) params.set('bonus', String(bonus))
        if (maxNetSalary !== undefined) params.set('maxNetSalary', String(maxNetSalary))
        if (minNetSalary !== undefined) params.set('minNetSalary', String(minNetSalary))
        if (workingDays !== undefined) params.set('workingDays', String(workingDays))
        if (fullName) params.set('fullName', fullName)

        const response = await AxiosInstance.get<{
            data: PayrollRow[]
            totalPages: number
        }>(`/salary?${params.toString()}`)
        return response.data
    }

    const {
        data: payrollData,
        isPending,
        isError,
    } = useQuery<{ data: PayrollRow[]; totalPages: number }, Error>({
        queryKey: [
            'payroll',
            month,
            year,
            page,
            pageSize,
            fullName,
            workingDays,
            minNetSalary,
            maxNetSalary,
            bonus,
        ],
        queryFn: () => fetchPayroll(),
    })

    const rows: PayrollRow[] =
        payrollData?.data.map((payrollItem, index) => ({
            id: page * pageSize + index + 1,
            originalId: payrollItem.userId._id,
            netSalary: `${payrollItem.netSalary}${payrollItem.currency}`,
            healthInsurance: `${payrollItem.healthInsurance}${payrollItem.currency}`,
            month: getMonthName(payrollItem.month as number),
            workingDays: payrollItem.workingDays,
            tax: payrollItem.tax,
            socialSecurity: payrollItem.socialSecurity,
            fullName: `${payrollItem.userId.firstName} ${payrollItem.userId.lastName}`,
            grossSalary: payrollItem.grossSalary,
            year: payrollItem.year,
            bonusDescription: payrollItem.bonusDescription,
            currency: payrollItem.currency,
            bonus: payrollItem.bonus,
            userId: payrollItem.userId,
        })) ?? []

    const columns = [
        { field: 'id', headerName: 'No', flex: 0.5 },
        { field: 'fullName', headerName: 'Full Name', flex: 1.7 },
        { field: 'netSalary', headerName: 'Net Salary', flex: 1.7 },
        { field: 'healthInsurance', headerName: 'Health Insurance', flex: 1.7 },
        { field: 'month', headerName: 'Month', flex: 1 },
        { field: 'workingDays', headerName: 'Working Days', flex: 1.5 },
        { field: 'socialSecurity', headerName: 'Social Security', flex: 1.5 },
        { field: 'grossSalary', headerName: 'Gross Salary', flex: 1 },
        { field: 'year', headerName: 'Year', flex: 1.5 },
        { field: 'bonus', headerName: 'Bonus', flex: 1.2 },
        { field: 'bonusDescription', headerName: 'Bonus Description', flex: 2 },
        { field: 'tax', headerName: 'Tax', flex: 2 },
    ]

    const headerTextColors = { firstName: '#0000FF' }

    const getRowId = (row: PayrollRow) => row.id

    const handleRowClick = (params: { row: PayrollRow }) => {
        navigate(`/payroll/user/${params.row.originalId}`)
    }

    const contextValue = {
        rows,
        columns,
        headerTextColors,
        getRowId,
        handleRowClick,
        setFullName,
        setMaxNetSalary,
        setMinNetSalary,
        setMonth,
        setYear,
        isPending,
        isError,
        setBonus,
        setWorkingDays,
        // Required by PayrollContextType interface
        setName: setFullName,
        netSalary,
        setNetSalary,
        filters,
        setFilters,
        page,
        pageSize,
        totalPages: payrollData?.totalPages ?? 0,
        handlePaginationModelChange,
    }

    return (
        <PayrollContext.Provider value={contextValue}>
            {children}
        </PayrollContext.Provider>
    )
}
