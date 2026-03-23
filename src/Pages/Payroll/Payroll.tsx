import React, { useEffect } from 'react'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import DataTable from '../../Components/Table/Table'
import { usePayrollContext } from './Context/PayrollTableContext'
import { PayrollProvider } from './Context/PayrollTableProvider'
import style from './styles/Payroll.module.css'
import { RingLoader } from 'react-spinners'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

function PayrollContent() {
    const {
        rows,
        columns,
        getRowId,
        handleRowClick,
        setFullName,
        isPending,
        page,
        pageSize,
        totalPages,
        totalCount,
        handlePaginationModelChange,
        isError,
        errorMessage,
    } = usePayrollContext()
    const [searchInput, setSearchInput] = React.useState('')
    const debouncedSearch = useDebouncedValue(searchInput, 400)
    const lastAppliedSearch = React.useRef<string | null>(null)

    useEffect(() => {
        const normalizedSearch = debouncedSearch.trim()

        if (lastAppliedSearch.current === normalizedSearch) {
            return
        }

        lastAppliedSearch.current = normalizedSearch
        setFullName(normalizedSearch)
    }, [debouncedSearch, setFullName])

    const handleClearSearch = () => {
        lastAppliedSearch.current = ''
        setSearchInput('')
        setFullName('')
    }

    const hasSearch = searchInput.trim() !== ''

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
                                    Use the employee search to quickly find the
                                    payroll rows you need.
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
                            title="Payroll table"
                            searchValue={searchInput}
                            onSearchChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                            searchPlaceholder="Search by employee name"
                            actions={
                                <Button
                                    btnText="Clear"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={handleClearSearch}
                                    disabled={!hasSearch}
                                />
                            }
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
