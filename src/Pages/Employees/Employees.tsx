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
        roleFilter,
        setRoleFilter,
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
                    Failed to load employees:{' '}
                    {error?.message ?? 'Unknown error'}
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
                filterNode={
                    <label className="flex w-full flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-44">
                        Role
                        <select
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value)
                            }
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-[#2457a3] focus:outline-none focus:ring-2 focus:ring-[#2457a3]/20"
                        >
                            <option value="all">All roles</option>
                            <option value="admin">Admin</option>
                            <option value="hr">HR</option>
                            <option value="dev">Developer</option>
                        </select>
                    </label>
                }
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
