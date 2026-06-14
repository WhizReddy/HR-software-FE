import React from 'react'
import DataTable from '../../Components/Table/Table'
import { usePayrollContext } from './Context/PayrollTableContext'
import { PayrollProvider } from './Context/PayrollTableProvider'
import style from './styles/Payroll.module.css'

function PayrollContent() {
    const {
        rows,
        columns,
        getRowId,
        handleRowClick,
        search,
        setFullName,
        clearSearch,
        resetFilters,
        hasActiveFilters,
        isPending,
        page,
        pageSize,
        totalPages,
        totalCount,
        handlePaginationModelChange,
        month,
        year,
        setMonth,
        setYear,
        isError,
        errorMessage,
    } = usePayrollContext()
    const hasSearch = search.trim() !== ''

    return (
        <div className={style.payrollPage}>
            {isError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <h2 className="text-base font-semibold">
                        Payroll failed to load
                    </h2>
                    <p className="mt-2 text-sm leading-6">
                        {errorMessage ||
                            'The payroll request failed. Please try again in a moment.'}
                    </p>
                </div>
            ) : (
                <>
                    <section className={style.panel}>
                        <div className={style.panelHeader}>
                            <div className={style.panelCopy}>
                                <span className={style.panelEyebrow}>
                                    Payroll
                                </span>
                                <h1 className={style.panelTitle}>
                                    Salary records
                                </h1>
                                <p className={style.panelDescription}>
                                    Use employee search and date filters to find
                                    the payroll rows you need.
                                </p>
                            </div>
                            <div className={style.panelMeta}>
                                {hasSearch
                                    ? 'Search active'
                                    : 'Simple search ready'}
                            </div>
                        </div>
                    </section>

                    <div className={style.tableSection}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            getRowId={getRowId}
                            handleRowClick={handleRowClick}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            page={page}
                            pageSize={pageSize}
                            onPaginationModelChange={
                                handlePaginationModelChange
                            }
                            searchValue={search}
                            onSearchChange={(event) =>
                                setFullName(event.target.value)
                            }
                            onSearchClear={clearSearch}
                            searchPlaceholder="Search by employee name"
                            onResetFilters={resetFilters}
                            hasActiveFilters={hasActiveFilters}
                            exportFileName="payroll"
                            exportTitle="Payroll table"
                            filterNode={
                                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                                    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-40">
                                        Month
                                        <select
                                            value={month ?? ''}
                                            onChange={(event) =>
                                                setMonth(
                                                    event.target.value
                                                        ? Number(
                                                              event.target
                                                                  .value,
                                                          )
                                                        : undefined,
                                                )
                                            }
                                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-[#2457a3] focus:outline-none focus:ring-2 focus:ring-[#2457a3]/20"
                                        >
                                            <option value="">All months</option>
                                            {Array.from(
                                                { length: 12 },
                                                (_, index) => (
                                                    <option
                                                        key={index + 1}
                                                        value={index + 1}
                                                    >
                                                        {index + 1}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-40">
                                        Year
                                        <input
                                            type="number"
                                            min="2000"
                                            max="2100"
                                            value={year ?? ''}
                                            onChange={(event) =>
                                                setYear(
                                                    event.target.value
                                                        ? Number(
                                                              event.target
                                                                  .value,
                                                          )
                                                        : undefined,
                                                )
                                            }
                                            placeholder="All years"
                                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-[#2457a3] focus:outline-none focus:ring-2 focus:ring-[#2457a3]/20"
                                        />
                                    </label>
                                </div>
                            }
                            isLoading={isPending}
                            loadingLabel="Loading payroll records..."
                        />
                    </div>
                </>
            )}
        </div>
    )
}

const Payroll: React.FC = () => {
    return (
        <PayrollProvider>
            <PayrollContent />
        </PayrollProvider>
    )
}

export default Payroll
