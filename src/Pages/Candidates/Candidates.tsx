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
