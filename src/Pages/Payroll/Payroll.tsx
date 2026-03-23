import React from 'react'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import DataTable from '../../Components/Table/Table'
import { usePayrollContext } from './Context/PayrollTableContext'
import { PayrollProvider } from './Context/PayrollTableProvider'
import style from './styles/Payroll.module.css'
import { RingLoader } from 'react-spinners'
import { Search } from 'lucide-react'

interface PayrollFilterValues {
    month: string
    fullName: string
    workingDays: string
    maxNetSalary: string
    minNetSalary: string
    bonus: string
}

const DEFAULT_FILTER_VALUES: PayrollFilterValues = {
    month: '',
    fullName: '',
    workingDays: '',
    maxNetSalary: '',
    minNetSalary: '',
    bonus: '',
}

const parseOptionalNumber = (value: string): number | undefined => {
    if (!value.trim()) {
        return undefined
    }

    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
}

function PayrollContent() {
    const {
        rows,
        columns,
        getRowId,
        handleRowClick,
        setMonth,
        setFullName,
        setBonus,
        setWorkingDays,
        setYear,
        isPending,
        setMaxNetSalary,
        setMinNetSalary,
        page,
        pageSize,
        totalPages,
        handlePaginationModelChange,
        isError,
        errorMessage,
    } = usePayrollContext()
    const [filterValues, setFilterValues] = React.useState<PayrollFilterValues>(
        DEFAULT_FILTER_VALUES,
    )

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value
        setFilterValues((prev) => ({
            ...prev,
            month: date,
        }))

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

    const handleFullNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value
        setFilterValues((prev) => ({
            ...prev,
            fullName: value,
        }))
        setFullName(value)
    }

    const handleWorkingDaysChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value
        setFilterValues((prev) => ({
            ...prev,
            workingDays: value,
        }))
        setWorkingDays(parseOptionalNumber(value))
    }

    const handleMinSalaryChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value
        setFilterValues((prev) => ({
            ...prev,
            minNetSalary: value,
        }))
        setMinNetSalary(parseOptionalNumber(value))
    }

    const handleMaxSalaryChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value
        setFilterValues((prev) => ({
            ...prev,
            maxNetSalary: value,
        }))
        setMaxNetSalary(parseOptionalNumber(value))
    }

    const handleBonusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setFilterValues((prev) => ({
            ...prev,
            bonus: value,
        }))
        setBonus(parseOptionalNumber(value))
    }

    const handleClearFilters = () => {
        setFilterValues(DEFAULT_FILTER_VALUES)
        setYear(undefined)
        setMonth(undefined)
        setFullName('')
        setWorkingDays(undefined)
        setMaxNetSalary(undefined)
        setMinNetSalary(undefined)
        setBonus(undefined)
    }

    const hasActiveFilters = Object.values(filterValues).some(
        (value) => value.trim() !== '',
    )

    return (
        <div className={style.payrollPage}>
            {isPending ? (
                <div className={style.ring}>
                    <RingLoader color="#2457A3" />
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
                    <h2 className="text-lg font-bold">
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
                                    Filter payroll by month, employee, working
                                    days, salary range, or bonus without the
                                    table jumping around.
                                </p>
                            </div>
                            <div className={style.panelMeta}>
                                {hasActiveFilters
                                    ? 'Filters applied'
                                    : 'Showing all payroll records'}
                            </div>
                        </div>

                        <div className={style.filterGrid}>
                            <Input
                                name="payroll-month"
                                type="month"
                                label="Month & Year"
                                isFilter
                                value={filterValues.month}
                                onChange={handleDateChange}
                            />
                            <Input
                                name="fullName"
                                type="text"
                                label="Employee"
                                isFilter
                                value={filterValues.fullName}
                                onChange={handleFullNameChange}
                                icon={<Search size={16} />}
                                iconPosition="start"
                            />
                            <Input
                                name="workingDays"
                                type="number"
                                label="Working Days"
                                isFilter
                                value={filterValues.workingDays}
                                onChange={handleWorkingDaysChange}
                            />
                            <Input
                                name="minNetSalary"
                                type="number"
                                label="Min Salary"
                                isFilter
                                value={filterValues.minNetSalary}
                                onChange={handleMinSalaryChange}
                            />
                            <Input
                                name="maxNetSalary"
                                type="number"
                                label="Max Salary"
                                isFilter
                                value={filterValues.maxNetSalary}
                                onChange={handleMaxSalaryChange}
                            />
                            <Input
                                name="bonus"
                                type="number"
                                label="Bonus"
                                isFilter
                                value={filterValues.bonus}
                                onChange={handleBonusChange}
                            />
                        </div>

                        <div className={style.panelActions}>
                            <Button
                                btnText="Clear filters"
                                type={ButtonTypes.SECONDARY}
                                onClick={handleClearFilters}
                                disabled={!hasActiveFilters}
                            />
                        </div>
                    </section>

                    <div className={style.tableSection}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            getRowId={getRowId}
                            handleRowClick={handleRowClick}
                            totalPages={totalPages}
                            page={page}
                            pageSize={pageSize}
                            onPaginationModelChange={
                                handlePaginationModelChange
                            }
                            title="Payroll table"
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
