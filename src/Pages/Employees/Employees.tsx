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
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mt-5">
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
