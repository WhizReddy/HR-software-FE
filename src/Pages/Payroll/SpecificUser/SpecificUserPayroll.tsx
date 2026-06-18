import React from 'react'
import DataTable from '@/Components/Table/Table'
import { PayrollProviderSpecific } from './Context/SpecificUserPayrollProvider'
import style from '../styles/Payroll.module.css'
import { usePayrollContextSpecific } from './Context/SpecificUserPayrollContext'
import { EventsProvider } from '@/Pages/Events/Context/EventsContext'

function SpecificUserPayrollContent() {
    const {
        rows,
        columns,
        getRowId,
        fullName,
        page,
        pageSize,
        totalPages,
        totalCount,
        handlePaginationModelChange,
        month,
        year,
        setMonth,
        setYear,
        resetFilters,
        hasActiveFilters,
        isPending,
        isError,
        errorMessage,
    } = usePayrollContextSpecific()

    if (isError) {
        return (
            <div className={style.payrollPage}>
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <h2 className="text-base font-semibold">
                        Payroll failed to load
                    </h2>
                    <p className="mt-2 text-sm leading-6">
                        {errorMessage ||
                            'The payroll request failed. Please try again in a moment.'}
                    </p>
                </div>
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
                            Salary history for this employee.
                        </p>
                    </div>
                    <div className={style.panelMeta}>History view</div>
                </div>
            </section>

            <div className={style.tableSection}>
                <DataTable
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    page={page}
                    pageSize={pageSize}
                    onPaginationModelChange={handlePaginationModelChange}
                    title="Payment history"
                    onResetFilters={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                    filterNode={
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Month
                                <select
                                    value={month ?? ''}
                                    onChange={(event) =>
                                        setMonth(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/25"
                                >
                                    <option value="">All months</option>
                                    {Array.from({ length: 12 }, (_, index) => (
                                        <option
                                            key={index + 1}
                                            value={index + 1}
                                        >
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Year
                                <input
                                    type="number"
                                    min="2000"
                                    max="2100"
                                    value={year ?? ''}
                                    onChange={(event) =>
                                        setYear(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                    placeholder="All years"
                                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/25"
                                />
                            </label>
                        </div>
                    }
                    isLoading={isPending}
                    loadingLabel="Loading payment history..."
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
