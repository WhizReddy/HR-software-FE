import Input from '@/Components/Input/Index'
import DataTable from '../../Components/Table/Table'
import { usePayrollContext } from './Context/PayrollTableContext'
import { PayrollProvider } from './Context/PayrollTableProvider'
import style from './styles/Payroll.module.css'
import { RingLoader } from 'react-spinners'
import { useState } from 'react'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Button from '@/Components/Button/Button'
import { X, Filter } from 'lucide-react'

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
    const [showFilters, setShowFilters] = useState(false)
    const [filterValues, setFilterValues] = useState<PayrollFilterValues>(
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

    return (
        <div className={style.payroll}>
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mt-5">
                    <DataTable
                        rows={rows}
                        columns={columns}
                        getRowId={getRowId}
                        handleRowClick={handleRowClick}
                        totalPages={totalPages}
                        page={page}
                        pageSize={pageSize}
                        onPaginationModelChange={handlePaginationModelChange}
                        filterNode={
                            <div className="flex items-center">
                                <Button
                                    btnText=""
                                    borderColor="transparent"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={() => setShowFilters((prev) => !prev)}
                                    icon={showFilters ? <X /> : <Filter />}
                                />
                                <div
                                    className={`transition-all duration-300 overflow-hidden ml-2 ${showFilters ? 'w-auto opacity-100' : 'w-0 opacity-0'
                                        }`}
                                >
                                    <div className="flex flex-wrap items-end gap-4">
                                        <Input
                                            width="150px"
                                            name="Filter"
                                            type="month"
                                            label="Month & Year"
                                            isFilter
                                            value={filterValues.month}
                                            onChange={handleDateChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="fullName"
                                            type="text"
                                            label="Full Name"
                                            isFilter
                                            value={filterValues.fullName}
                                            onChange={handleFullNameChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="workingDays"
                                            type="number"
                                            label="Working Days"
                                            isFilter
                                            value={filterValues.workingDays}
                                            onChange={handleWorkingDaysChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="maxNetSalary"
                                            type="number"
                                            label="Max Salary"
                                            isFilter
                                            value={filterValues.maxNetSalary}
                                            onChange={handleMaxSalaryChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="minNetSalary"
                                            type="number"
                                            label="Min Salary"
                                            isFilter
                                            value={filterValues.minNetSalary}
                                            onChange={handleMinSalaryChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="bonus"
                                            type="number"
                                            label="Bonus"
                                            isFilter
                                            value={filterValues.bonus}
                                            onChange={handleBonusChange}
                                        />
                                        <Button
                                            btnText="Clear"
                                            type={ButtonTypes.SECONDARY}
                                            onClick={handleClearFilters}
                                            className="shrink-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>
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
