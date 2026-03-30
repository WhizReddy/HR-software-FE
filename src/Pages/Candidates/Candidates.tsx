import DataTable from '@/Components/Table/Table'
import { useCandidateContext } from './Context/CandidateTableContext'
import { CandidateProvider } from './Context/CandidateTableProvider'
import { RingLoader } from 'react-spinners'

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
            <div className="mb-8 relative z-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Candidate Pipeline
                </h1>
                <p className="text-slate-500 mt-2 text-base max-w-2xl">
                    Search and review applicants consistently across the hiring pipeline.
                </p>
            </div>
            {isPending ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <RingLoader color="var(--primary-blue)" />
                </div>
            ) : (
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
                />
            )}
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
