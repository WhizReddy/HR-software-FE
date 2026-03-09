import DataTable from '@/Components/Table/Table'
import { PayrollProviderSpecific } from './Context/SpecificUserPayrollProvider'
import style from '../styles/Payroll.module.css'
import { usePayrollContextSpecific } from './Context/SpecificUserPayrollContext'
import Input from '@/Components/Input/Index'
import { EventsProvider } from '@/Pages/Events/Context/EventsContext'
import { RingLoader } from 'react-spinners'

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
    } = usePayrollContextSpecific()

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value
        const [yearString, monthString] = date.split('-')
        setYear(parseInt(yearString))
        setMonth(parseInt(monthString) - 1)
    }

    if (isPending)
        return (
            <div
                style={{
                    display: 'flex',
                    fontSize: '30px',
                    justifyContent: 'center',
                    marginTop: '50px',
                }}
            >
                {' '}
                <RingLoader />
            </div>
        )

    return (
        <div className={style.payroll}>
            <div
                style={{
                    display: 'flex',
                    gap: '25px',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    position: 'absolute',
                    top: 77,
                }}
            >
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {fullName}
                </div>
                <Input
                    width={250}
                    name="Filter"
                    type="month"
                    label="Month & Year"
                    IsUsername
                    onChange={handleDateChange}
                />
            </div>
            <DataTable
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                totalPages={totalPages}
                page={page}
                pageSize={pageSize}
                onPaginationModelChange={handlePaginationModelChange}
            />
            <div
                style={{
                    width: '500px',
                    marginTop: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            ></div>
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
