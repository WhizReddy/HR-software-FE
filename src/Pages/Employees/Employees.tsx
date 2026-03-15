import { RingLoader } from 'react-spinners'
import DataTable from '../../Components/Table/Table'
import { useEmployeeContext } from './Context/EmployeTableContext'
import { EmployeeProvider } from './Context/EmployeTableProvider'
import PageIntro from '@/Components/PageIntro/PageIntro'
function EmployeesContent() {
    const {
        rows,
        columns,
        getRowId,
        handleRowClick,
        handlePaginationModelChange,
        page,
        pageSize,
        totalPages,
        isPending,
        search,
        setSearch,
    } = useEmployeeContext()

    return (
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8">
            <PageIntro
                eyebrow="People"
                title="Employee Directory"
                description="Manage your organization's workforce, browse profiles, and move through employee records from one consistent workspace."
                className="mb-8"
            />
            {isPending ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <RingLoader color="#2457A3" />
                </div>
            ) : (
                <DataTable
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                    handleRowClick={handleRowClick}
                    totalPages={totalPages}
                    page={page}
                    pageSize={pageSize}
                    onPaginationModelChange={handlePaginationModelChange}
                    searchValue={search}
                    onSearchChange={(e) => setSearch(e.target.value)}
                    searchPlaceholder="Search employees..."
                />
            )}
        </div>
    )
}

const Employees: React.FC = () => {
    return (
        <EmployeeProvider>
            <EmployeesContent />
        </EmployeeProvider>
    )
}

export default Employees
