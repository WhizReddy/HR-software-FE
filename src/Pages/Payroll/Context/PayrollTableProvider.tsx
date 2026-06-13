import React, { useCallback, useState } from 'react'
import { PayrollContext, PayrollRow } from '../Interface/Payroll'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { getMonthName } from '../utils/Utils'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import {
    fetchAllPaginatedData,
    matchesSearchText,
    paginateClientRows,
    PaginatedResponse,
} from '@/Helpers/clientTableFiltering'

const parseOptionalNumberParam = (value: string | null) => {
    if (!value) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [netSalary, setNetSalary] = useState<number | undefined>(undefined)
    const [filters, setFilters] = useState<Record<string, string | boolean>>({})
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        searchValue: search,
        setSearchValue: setSearch,
        searchQuery,
        clearSearch,
        resetTableState,
        page,
        pageSize,
        handlePaginationModelChange,
    } = useUrlTableState({
        searchParams,
        setSearchParams,
    })
    const month = parseOptionalNumberParam(searchParams.get('month'))
    const year = parseOptionalNumberParam(searchParams.get('year'))

    const updateNumberFilter = useCallback(
        (key: 'month' | 'year', value: number | undefined) => {
            setSearchParams((prev) => {
                const nextParams = upsertFilterParams(
                    prev,
                    {
                        [key]: value,
                    },
                    { resetPage: true },
                )

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            })
        },
        [setSearchParams],
    )

    const handleFullNameChange = useCallback(
        (value: string) => {
            setSearch((currentValue) =>
                currentValue === value ? currentValue : value,
            )
        },
        [setSearch],
    )

    const resetFilters = useCallback(() => {
        resetTableState({ month: null, year: null })
    }, [resetTableState])

    const navigate = useNavigate()

    const fetchPayrollPage = async (
        pageToFetch: number,
        limitToFetch: number,
    ): Promise<Required<PaginatedResponse<PayrollRow>>> => {
        const params = new URLSearchParams()

        params.set('limit', String(limitToFetch))
        params.set('page', String(pageToFetch))

        if (searchQuery.trim()) {
            params.set('search', searchQuery)
        }

        if (month !== undefined) {
            params.set('month', String(month))
        }

        if (year !== undefined) {
            params.set('year', String(year))
        }

        const response = await AxiosInstance.get<{
            data: PayrollRow[]
            totalPages: number
            all: number
        }>(`/salary?${params.toString()}`)
        return response.data
    }

    const matchesPayrollFilters = (payrollItem: PayrollRow) => {
        const fullName = payrollItem.userId
            ? `${payrollItem.userId.firstName} ${payrollItem.userId.lastName}`
            : ''
        const matchesMonth =
            month === undefined || Number(payrollItem.month) === month
        const matchesYear =
            year === undefined || Number(payrollItem.year) === year

        return (
            matchesMonth &&
            matchesYear &&
            matchesSearchText(searchQuery, [
                fullName,
                payrollItem.userId?.firstName,
                payrollItem.userId?.lastName,
                payrollItem.currency,
                payrollItem.bonusDescription,
            ])
        )
    }

    const fetchPayroll = async (): Promise<
        Required<PaginatedResponse<PayrollRow>>
    > => {
        const shouldFilterClientSide =
            searchQuery.trim() !== '' ||
            month !== undefined ||
            year !== undefined

        if (!shouldFilterClientSide) {
            return fetchPayrollPage(page, pageSize)
        }

        const allPayrollRows =
            await fetchAllPaginatedData<PayrollRow>(fetchPayrollPage)
        const filteredPayrollRows = allPayrollRows.filter(matchesPayrollFilters)

        return paginateClientRows(filteredPayrollRows, page, pageSize)
    }

    const {
        data: payrollData,
        isPending,
        isError,
        error,
    } = useQuery<Required<PaginatedResponse<PayrollRow>>, Error>({
        queryKey: ['payroll', page, pageSize, searchQuery, month, year],
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
        setMonth: (value: number | undefined) =>
            updateNumberFilter('month', value),
        setYear: (value: number | undefined) =>
            updateNumberFilter('year', value),
        isPending,
        isError,
        errorMessage: error?.message || null,
        setBonus: () => undefined,
        setWorkingDays: () => undefined,
        setName: handleFullNameChange,
        month,
        year,
        search,
        clearSearch,
        resetFilters,
        hasActiveFilters:
            search.trim() !== '' || month !== undefined || year !== undefined,
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
