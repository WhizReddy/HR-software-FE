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
    } = useCandidateContext()

    return (
        <div className="w-full flex-1 p-4 sm:p-6 lg:p-8">
            <PageIntro
                eyebrow="Hiring"
                title="Candidate Pipeline"
                description="Search and review applicants consistently across the hiring pipeline."
                className="mb-8"
            />
            {isError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Failed to load candidates: {error?.message ?? 'Unknown error'}
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
