import { RingLoader } from 'react-spinners'
import DataTable from '../../Components/Table/Table'
import { useEmployeeContext } from './Context/EmployeTableContext'
import { EmployeeProvider } from './Context/EmployeTableProvider'
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
            <div className="mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Directory</h1>
                <p className="text-slate-500 mt-2 text-base max-w-2xl">
                    Manage your organization's entire workforce. View profiles, search for specific roles, and manage access in one central hub.
                </p>
            </div>
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
