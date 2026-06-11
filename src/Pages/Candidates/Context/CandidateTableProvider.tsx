import React from 'react'
import { CandidateContext, CandidateRow } from '../Interfaces/Candidate'
import { RenderCellParams } from '@/types/table'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import {
    fetchAllPaginatedData,
    matchesSearchText,
    normalizeFilterText,
    normalizePaginatedResponse,
    paginateClientRows,
    PaginatedResponse,
} from '@/Helpers/clientTableFiltering'

export const CandidateProvider: React.FC<{ children: any }> = ({
    children,
}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const {
        searchValue: search,
        setSearchValue: setSearch,
        searchQuery,
        clearSearch,
        page,
        pageSize,
        handlePaginationModelChange,
    } = useUrlTableState({
        searchParams,
        setSearchParams,
    })
    const statusFilter = searchParams.get('status') || 'all'

    const setStatusFilter = React.useCallback(
        (status: string) => {
            setSearchParams((prev) => {
                const nextParams = upsertFilterParams(
                    prev,
                    {
                        status: status === 'all' ? null : status,
                    },
                    { resetPage: true },
                )

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            })
        },
        [setSearchParams],
    )

    const fetchCandidatesPage = async (
        pageToFetch: number,
        limitToFetch: number,
    ): Promise<PaginatedResponse<CandidateRow>> => {
        const params = new URLSearchParams({
            page: String(pageToFetch),
            limit: String(limitToFetch),
        })

        const response = await AxiosInstance.get(
            `/applicant?${params.toString()}`,
        )
        return normalizePaginatedResponse(response.data)
    }

    const matchesCandidateFilters = (candidate: CandidateRow) => {
        const fullName = `${candidate.firstName} ${candidate.lastName}`
        const matchesStatus =
            statusFilter === 'all' ||
            normalizeFilterText(candidate.status) ===
                normalizeFilterText(statusFilter)

        return (
            matchesStatus &&
            matchesSearchText(searchQuery, [
                fullName,
                candidate.firstName,
                candidate.lastName,
                candidate.email,
                candidate.phoneNumber,
                candidate.positionApplied,
                candidate.status,
                candidate.experience,
                candidate.applicationMethod,
            ])
        )
    }

    const fetchCandidates = async (): Promise<
        Required<PaginatedResponse<CandidateRow>>
    > => {
        const shouldFilterClientSide =
            searchQuery.trim() !== '' || statusFilter !== 'all'

        if (!shouldFilterClientSide) {
            const response = await fetchCandidatesPage(page, pageSize)
            return {
                data: response.data,
                totalPages: response.totalPages ?? 1,
                all: response.all ?? response.data.length,
            }
        }

        const allCandidates =
            await fetchAllPaginatedData<CandidateRow>(fetchCandidatesPage)
        const filteredCandidates = allCandidates.filter(matchesCandidateFilters)

        return paginateClientRows(filteredCandidates, page, pageSize)
    }

    const {
        data: applicants,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ['applicants', page, pageSize, searchQuery, statusFilter],
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
            phoneNumber: applicant.phoneNumber.startsWith('+')
                ? applicant.phoneNumber
                : `+355${applicant.phoneNumber}`,
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
            field: 'status',
            headerName: 'Status',
            flex: 1.3,
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
                return (
                    <StatusBadge
                        status={params.value as string}
                        color={color}
                    />
                )
            },
        },
        { field: 'phoneNumber', headerName: 'Phone', flex: 1.8 },
        { field: 'positionApplied', headerName: 'Position', flex: 1.8 },
        { field: 'experience', headerName: 'Experience', flex: 1.3 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.3,
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
        clearSearch,
        statusFilter,
        setStatusFilter,
        totalPages: applicants?.totalPages ?? 0,
        isPending,
        isError,
        error: error ?? null,
    }

    return (
        <CandidateContext.Provider value={contextValue}>
            {children}
        </CandidateContext.Provider>
    )
}
