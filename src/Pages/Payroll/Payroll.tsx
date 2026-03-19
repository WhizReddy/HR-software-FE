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
    } = usePayrollContext()

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value
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
        setFullName(event.target.value)
    }

    const handleWorkingDaysChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setWorkingDays(parseOptionalNumber(event.target.value))
    }

    const handleMinSalaryChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setMinNetSalary(parseOptionalNumber(event.target.value))
    }

    const handleMaxSalaryChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setMaxNetSalary(parseOptionalNumber(event.target.value))
    }

    const handleBonusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBonus(parseOptionalNumber(event.target.value))
    }

    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className={style.payroll}>
            {isPending ? (
                <div className={style.ring}>
                    <RingLoader color="#2457A3" />
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
                                    <div className="flex gap-4">
                                        <Input
                                            width="150px"
                                            name="Filter"
                                            type="month"
                                            label="Month & Year"
                                            isFilter
                                            onChange={handleDateChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="fullName"
                                            type="text"
                                            label="Full Name"
                                            isFilter
                                            onChange={handleFullNameChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="workingDays"
                                            type="number"
                                            label="Working Days"
                                            isFilter
                                            onChange={handleWorkingDaysChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="maxNetSalary"
                                            type="number"
                                            label="Max Salary"
                                            isFilter
                                            onChange={handleMaxSalaryChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="minNetSalary"
                                            type="number"
                                            label="Min Salary"
                                            isFilter
                                            onChange={handleMinSalaryChange}
                                        />
                                        <Input
                                            width="150px"
                                            name="bonus"
                                            type="number"
                                            label="Bonus"
                                            isFilter
                                            onChange={handleBonusChange}
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
