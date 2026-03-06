import React from 'react'
import { CandidateContext, CandidateRow } from '../Interfaces/Candidate'
import { PaginationModel, RenderCellParams } from '@/types/table'
import { Link, useNavigate } from 'react-router-dom'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'

export const CandidateProvider: React.FC<{ children: any }> = ({ children }) => {
    const [page, setPage] = React.useState(0)
    const [pageSize, setPageSize] = React.useState(5)
    const [search, setSearch] = React.useState('')

    // Add simple debounce effect for search
    const [debouncedSearch, setDebouncedSearch] = React.useState(search)
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    const handlePaginationModelChange = (model: PaginationModel) => {
        setPage(model.page)
        setPageSize(model.pageSize)
    }

    const fetchCandidates = async (): Promise<{ data: CandidateRow[], totalPages: number }> => {
        const response = await AxiosInstance.get(`/applicant?page=${page}&limit=${pageSize}&search=${debouncedSearch}`)
        return response.data
    }

    const { data: applicants, isPending } = useQuery({
        queryKey: ['applicants', page, pageSize, debouncedSearch],
        queryFn: () => fetchCandidates(),
    })

    const navigate = useNavigate()

    const rows: CandidateRow[] =
        applicants?.data.map((applicant, index) => ({
            id: page * pageSize + index + 1,
            _id: applicant._id,
            originalId: applicant._id,
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            fullName: `${applicant.firstName} ${applicant.lastName}`,
            email: applicant.email,
            phoneNumber: applicant.phoneNumber,
            experience: applicant.experience,
            applicationMethod: applicant.applicationMethod,
            age: applicant.age,
            positionApplied: applicant.positionApplied,
            technologiesUsed: applicant.technologiesUsed,
            salaryExpectations: applicant.salaryExpectations,
            status: applicant.status,
        })) ?? []

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5 },
        { field: 'fullName', headerName: 'FullName', flex: 1.2 },
        { field: 'email', headerName: 'Email', flex: 2 },
        {
            field: 'status', headerName: 'Status', flex: 1.3,
            renderCell: (params: RenderCellParams<CandidateRow>) => {
                const color =
                    params.value === 'active'
                        ? 'green'
                        : params.value === 'pending'
                            ? 'orange'
                            : params.value === 'rejected'
                                ? 'red'
                                : params.value === 'employed'
                                    ? 'purple'
                                    : ''
                return <StatusBadge status={params.value as string} color={color} />
            },
        },
        { field: 'phoneNumber', headerName: 'Phone', flex: 1.8 },
        { field: 'positionApplied', headerName: 'Position', flex: 1.8, },
        { field: 'experience', headerName: 'Experience', flex: 1.3 },
        {
            field: 'actions', headerName: 'Actions', flex: 1.3,
            renderCell: (params: RenderCellParams<CandidateRow>) => (
                <Link
                    style={{ textDecoration: 'none', color: '#4C556B' }}
                    to={`/view/${params.row.originalId}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    View More
                </Link>
            ),
        },
    ]

    const getRowId = (row: CandidateRow) => row.id

    const handleRowClick = (params: { row: CandidateRow }) => {
        navigate(`/view/${params.row.originalId}`)
    }

    const contextValue = {
        rows,
        columns,
        getRowId,
        handleRowClick,
        handlePaginationModelChange,
        page,
        pageSize,
        search,
        setSearch,
        totalPages: applicants?.totalPages ?? 0,
        isPending,
    }

    return (
        <CandidateContext.Provider value={contextValue}>
            {children}
        </CandidateContext.Provider>
    )
}