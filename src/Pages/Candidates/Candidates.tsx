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
        setSearch
    } = useCandidateContext()

    return (
        <div className="modern-card" style={{ marginTop: '20px' }}>
            {isPending ? (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '60vh',
                    }}
                >
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