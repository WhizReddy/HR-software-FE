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
        isError,
        error,
        search,
        setSearch,
        clearSearch,
    } = useEmployeeContext()

    return (
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8">
            <PageIntro
                eyebrow="People"
                title="Employee Directory"
                description="Manage your organization's workforce, browse profiles, and move through employee records from one consistent workspace."
                className="mb-8"
            />
            {isError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Failed to load employees: {error?.message ?? 'Unknown error'}
                </div>
            )}
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
                onSearchClear={clearSearch}
                searchPlaceholder="Search employees..."
                isLoading={isPending}
                loadingLabel="Loading employee records..."
            />
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
