import React from 'react'
import DataTable from '@/Components/Table/Table'
import { PayrollProviderSpecific } from './Context/SpecificUserPayrollProvider'
import style from '../styles/Payroll.module.css'
import { usePayrollContextSpecific } from './Context/SpecificUserPayrollContext'
import { EventsProvider } from '@/Pages/Events/Context/EventsContext'
import { RingLoader } from 'react-spinners'

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
        isPending,
        isError,
        errorMessage,
    } = usePayrollContextSpecific()

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
