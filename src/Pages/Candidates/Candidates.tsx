import DataTable from '@/Components/Table/Table'
import { useCandidateContext } from './Context/CandidateTableContext'
import { CandidateProvider } from './Context/CandidateTableProvider'
import PageIntro from '@/Components/PageIntro/PageIntro'

const pipelineStages = [
    'Applied',
    'Screening',
    'Interview',
    'Assessment',
    'Offer',
    'Hired',
]

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
                title="Candidates"
                description="Review applicants, update statuses, and keep hiring details easy to find."
                className="mb-8"
            />
            <section
                aria-label="ATS pipeline stages"
                className="mb-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-5"
            >
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase text-[#2457a3]">
                            ATS Flow
                        </p>
                        <h2 className="mt-1 text-base font-semibold text-slate-950">
                            Hiring stages at a glance
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500">
                        Visual guide only; candidate status behavior stays
                        unchanged.
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {pipelineStages.map((stage, index) => (
                        <div
                            key={stage}
                            className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-[#2457a3] shadow-sm">
                                {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                                {stage}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
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
