import React, { useCallback, useState } from 'react'
import { PayrollContext, PayrollRow } from '../Interface/Payroll'
import { PaginationModel } from '@/types/table'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { getMonthName } from '../utils/Utils'

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [fullName, setFullName] = useState('')
    const [netSalary, setNetSalary] = useState<number | undefined>(undefined)
    const [filters, setFilters] = useState<Record<string, string | boolean>>({})
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)

    const handleFullNameChange = useCallback((value: string) => {
        setFullName((currentValue) => {
            if (currentValue === value) {
                return currentValue
            }

            setPage(0)
            return value
        })
    }, [])

    const handlePaginationModelChange = useCallback(
        (model: PaginationModel) => {
            setPage((currentPage) =>
                currentPage === model.page ? currentPage : model.page,
            )
            setPageSize((currentPageSize) =>
                currentPageSize === model.pageSize
                    ? currentPageSize
                    : model.pageSize,
            )
        },
        [],
    )

    const navigate = useNavigate()

    const fetchPayroll = async (): Promise<{
        data: PayrollRow[]
        totalPages: number
        all: number
    }> => {
        const params = new URLSearchParams()
        const trimmedFullName = fullName.trim()

        params.set('limit', String(pageSize))
        params.set('page', String(page))
        if (trimmedFullName) params.set('fullName', trimmedFullName)

        const response = await AxiosInstance.get<{
            data: PayrollRow[]
            totalPages: number
            all: number
        }>(`/salary?${params.toString()}`)
        return response.data
    }

    const {
        data: payrollData,
        isPending,
        isError,
        error,
    } = useQuery<{ data: PayrollRow[]; totalPages: number; all: number }, Error>({
        queryKey: ['payroll', page, pageSize, fullName],
        queryFn: () => fetchPayroll(),
        placeholderData: (previousData) => previousData,
    })

    const rows: PayrollRow[] =
        payrollData?.data.map((payrollItem, index) => ({
            id: page * pageSize + index + 1,
            originalId: payrollItem.userId?._id || '',
            netSalary: `${payrollItem.netSalary} ${payrollItem.currency}`,
            healthInsurance: `${payrollItem.healthInsurance} ${payrollItem.currency}`,
            month: getMonthName(payrollItem.month as number),
            workingDays: payrollItem.workingDays,
            tax: payrollItem.tax,
            socialSecurity: payrollItem.socialSecurity,
            fullName: payrollItem.userId
                ? `${payrollItem.userId.firstName} ${payrollItem.userId.lastName}`
                : 'Unknown user',
            grossSalary: payrollItem.grossSalary,
            year: payrollItem.year,
            bonusDescription: payrollItem.bonusDescription,
            currency: payrollItem.currency,
            bonus: payrollItem.bonus,
            userId: payrollItem.userId || {
                _id: '',
                firstName: 'Unknown',
                lastName: 'User',
            },
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
        if (!params.row.originalId) {
            return
        }
        navigate(`/payroll/user/${params.row.originalId}`)
    }

    const contextValue = {
        rows,
        columns,
        headerTextColors,
        getRowId,
        handleRowClick,
        setFullName: handleFullNameChange,
        setMaxNetSalary: () => undefined,
        setMinNetSalary: () => undefined,
        setMonth: () => undefined,
        setYear: () => undefined,
        isPending,
        isError,
        errorMessage: error?.message || null,
        setBonus: () => undefined,
        setWorkingDays: () => undefined,
        setName: handleFullNameChange,
        netSalary,
        setNetSalary,
        filters,
        setFilters,
        page,
        pageSize,
        totalPages: payrollData?.totalPages ?? 0,
        totalCount: payrollData?.all ?? rows.length,
        handlePaginationModelChange,
    }

    return (
        <PayrollContext.Provider value={contextValue}>
            {children}
        </PayrollContext.Provider>
    )
}
