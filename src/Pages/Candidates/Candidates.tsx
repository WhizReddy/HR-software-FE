import DataTable from '@/Components/Table/Table'
import { useCandidateContext } from './Context/CandidateTableContext'
import { CandidateProvider } from './Context/CandidateTableProvider'
import PageIntro from '@/Components/PageIntro/PageIntro'

function CandidatesCoontext() {
    const {
        getRowId,
        columns,
        rows,
        handleRowClick,
        handlePaginationModelChange,
        totalPages,
        page,
        pageSize,
        isPending,
        isError,
        error,
        search,
        setSearch,
        clearSearch,
        resetFilters,
        hasActiveFilters,
        statusFilter,
        setStatusFilter,
    } = useCandidateContext()

    return (
        <div className="w-full flex-1">
            <PageIntro
                eyebrow="Hiring"
                title="Candidate Pipeline"
                description="Review applicants, update statuses, and keep hiring details easy to find."
                className="mb-8"
            />
            {isError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Failed to load candidates:{' '}
                    {error?.message ?? 'Unknown error'}
                </div>
            )}
            <DataTable
                getRowId={getRowId}
                columns={columns}
                rows={rows}
                handleRowClick={handleRowClick}
                totalPages={totalPages}
                page={page}
                pageSize={pageSize}
                onPaginationModelChange={handlePaginationModelChange}
                searchValue={search}
                onSearchChange={(e) => setSearch(e.target.value)}
                onSearchClear={clearSearch}
                searchPlaceholder="Search candidates..."
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                exportFileName="candidates"
                exportTitle="Candidate Pipeline"
                filterNode={
                    <label className="flex w-full flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-44">
                        Status
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-[#2457a3] focus:outline-none focus:ring-2 focus:ring-[#2457a3]/20"
                        >
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                            <option value="employed">Employed</option>
                        </select>
                    </label>
                }
                isLoading={isPending}
                loadingLabel="Loading candidate records..."
            />
        </div>
    )
}

const Candidates: React.FC = () => {
    return (
        <CandidateProvider>
            <CandidatesCoontext />
        </CandidateProvider>
    )
}

export default Candidates
