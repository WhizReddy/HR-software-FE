import React, { useState } from 'react'
import DataTable from '@/Components/Table/Table'
import { PayrollProviderSpecific } from './Context/SpecificUserPayrollProvider'
import style from '../styles/Payroll.module.css'
import { usePayrollContextSpecific } from './Context/SpecificUserPayrollContext'
import Input from '@/Components/Input/Index'
import { EventsProvider } from '@/Pages/Events/Context/EventsContext'
import { RingLoader } from 'react-spinners'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'

const parseOptionalNumber = (value: string): number | undefined => {
    if (!value.trim()) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

function SpecificUserPayrollContent() {
    const {
        rows,
        columns,
        getRowId,
        setMonth,
        setYear,
        fullName,
        page,
        pageSize,
        totalPages,
        handlePaginationModelChange,
        isPending,
        isError,
        errorMessage,
    } = usePayrollContextSpecific()
    const [monthValue, setMonthValue] = useState('')

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value
        setMonthValue(date)

        if (!date) {
            setYear(undefined)
            setMonth(undefined)
            return
        }

        const [yearString, monthString] = date.split('-')
        setYear(parseOptionalNumber(yearString))
        const parsedMonth = parseOptionalNumber(monthString)
        setMonth(parsedMonth !== undefined ? parsedMonth - 1 : undefined)
    }

    const handleClearFilters = () => {
        setMonthValue('')
        setYear(undefined)
        setMonth(undefined)
    }

    const hasActiveFilters = monthValue.trim() !== ''

    if (isPending) {
        return (
            <div className={style.ring}>
                <RingLoader />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
                <h2 className="text-lg font-bold">Payroll failed to load</h2>
                <p className="mt-2 text-sm leading-6">
                    {errorMessage ||
                        'The payroll request failed. Please try again in a moment.'}
                </p>
            </div>
        )
    }

    return (
        <div className={style.payrollPage}>
            <section className={style.panel}>
                <div className={style.panelHeader}>
                    <div className={style.panelCopy}>
                        <span className={style.panelEyebrow}>Payroll</span>
                        <h1 className={style.panelTitle}>
                            {fullName || 'Employee payroll'}
                        </h1>
                        <p className={style.panelDescription}>
                            Review this employee&apos;s salary history in a
                            stable layout and filter it by month when needed.
                        </p>
                    </div>
                    <div className={style.panelMeta}>
                        {hasActiveFilters
                            ? 'Month filter applied'
                            : 'Full payment history'}
                    </div>
                </div>

                <div className={style.filterGridCompact}>
                    <Input
                        name="payroll-month"
                        type="month"
                        label="Month & Year"
                        isFilter
                        value={monthValue}
                        onChange={handleDateChange}
                    />
                    <div className={style.inlineActions}>
                        <Button
                            btnText="Clear filter"
                            type={ButtonTypes.SECONDARY}
                            onClick={handleClearFilters}
                            disabled={!hasActiveFilters}
                        />
                    </div>
                </div>
            </section>

            <div className={style.tableSection}>
                <DataTable
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    totalPages={totalPages}
                    page={page}
                    pageSize={pageSize}
                    onPaginationModelChange={handlePaginationModelChange}
                    title="Payment history"
                />
            </div>
        </div>
    )
}

const SpecificUserPayroll: React.FC = () => {
    return (
        <EventsProvider>
            <PayrollProviderSpecific>
                <SpecificUserPayrollContent />
            </PayrollProviderSpecific>
        </EventsProvider>
    )
}

export default SpecificUserPayroll
