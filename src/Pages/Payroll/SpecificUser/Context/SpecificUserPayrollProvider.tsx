import React, { useEffect, useState } from 'react'
import { PayrollContextSpecific, PayrollRowSpecifc } from '../interface'
import { PaginationModel } from '@/types/table'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { getMonthName } from '../../utils/Utils'
import {
    ensurePaginationParams,
    hasSearchParamsChanged,
    parseNumberParam,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import {
    fetchAllPaginatedData,
    paginateClientRows,
    PaginatedResponse,
} from '@/Helpers/clientTableFiltering'

export const PayrollProviderSpecific: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = parseNumberParam(searchParams, 'page', 0)
    const pageSize = parseNumberParam(searchParams, 'limit', 5)
    const month = searchParams.get('month')
        ? parseNumberParam(searchParams, 'month', 0)
        : undefined
    const year = searchParams.get('year')
        ? parseNumberParam(searchParams, 'year', 0)
        : undefined
    const [employeeName, setEmployeeName] = useState('')

    useEffect(() => {
        setSearchParams(
            (prev) => {
                const nextParams = ensurePaginationParams(prev)

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            },
            { replace: true },
        )
    }, [setSearchParams])

    const setUrlFilter = (key: 'month' | 'year', value: number | undefined) => {
        setSearchParams(
            (prev) => {
                const nextParams = upsertFilterParams(
                    prev,
                    { [key]: value },
                    { resetPage: true },
                )

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            },
            { replace: true },
        )
    }

    const resetFilters = () => {
        setSearchParams(
            (prev) => {
                const nextParams = upsertFilterParams(
                    prev,
                    { month: null, year: null },
                    { resetPage: true },
                )

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            },
            { replace: true },
        )
    }

    const handlePaginationModelChange = (model: PaginationModel) => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(prev, {
                page: model.page,
                limit: model.pageSize,
            })

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }

    const fetchPayrollPage = async (
        pageToFetch: number,
        limitToFetch: number,
    ): Promise<Required<PaginatedResponse<PayrollRowSpecifc>>> => {
        const params = new URLSearchParams({
            limit: String(limitToFetch),
            page: String(pageToFetch),
        })

        const response = await AxiosInstance.get<{
            data: PayrollRowSpecifc[]
            totalPages: number
            all: number
        }>(`/salary/user/${id}?${params.toString()}`)
        return response.data
    }

    const fetchPayroll = async (): Promise<
        Required<PaginatedResponse<PayrollRowSpecifc>>
    > => {
        const shouldFilterClientSide = month !== undefined || year !== undefined

        if (!shouldFilterClientSide) {
            return fetchPayrollPage(page, pageSize)
        }

        const allPayrollRows =
            await fetchAllPaginatedData<PayrollRowSpecifc>(fetchPayrollPage)
        const filteredPayrollRows = allPayrollRows.filter((payrollItem) => {
            const matchesMonth =
                month === undefined || Number(payrollItem.month) === month
            const matchesYear =
                year === undefined || Number(payrollItem.year) === year

            return matchesMonth && matchesYear
        })

        return paginateClientRows(filteredPayrollRows, page, pageSize)
    }

    const {
        data: payrollId,
        isPending,
        isError,
        error,
    } = useQuery<Required<PaginatedResponse<PayrollRowSpecifc>>, Error>({
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
        month,
        year,
        setMonth: (value: number | undefined) => setUrlFilter('month', value),
        setYear: (value: number | undefined) => setUrlFilter('year', value),
        resetFilters,
        hasActiveFilters: month !== undefined || year !== undefined,
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
