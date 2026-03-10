import React, { useState } from 'react'
import { PaginationModel, RenderCellParams } from '@/types/table'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { EmployeeContext, EmployeeRow, UserProfileData } from '../interfaces/Employe'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import {
    ensurePaginationParams,
    hasSearchParamsChanged,
    parseNumberParam,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const debouncedSearch = useDebouncedValue(search, 400)

    React.useEffect(() => {
        setSearchParams((prev) => {
            const nextParams = ensurePaginationParams(prev)
            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [setSearchParams])

    React.useEffect(() => {
        const urlSearch = searchParams.get('search') || ''
        setSearch((prev) => (prev === urlSearch ? prev : urlSearch))
    }, [searchParams])

    React.useEffect(() => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                { search: debouncedSearch.trim() || null },
                { resetPage: true },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [debouncedSearch, setSearchParams])

    const page = parseNumberParam(searchParams, 'page', 0)
    const pageSize = parseNumberParam(searchParams, 'limit', 5)

    const handlePaginationModelChange = (model: PaginationModel) => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(prev, {
                page: model.page.toString(),
                limit: model.pageSize.toString(),
            })

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }

    const fetchEmployes = async () => {
        const response = await AxiosInstance.get<{ data: UserProfileData[], totalPages: number }>(`/user?page=${page}&limit=${pageSize}&search=${debouncedSearch}`)
        return response.data
    }

    const { data: users, isPending } = useQuery<{ data: UserProfileData[]; totalPages: number }, Error>({
        queryKey: ['users', page, pageSize, debouncedSearch],
        queryFn: () => fetchEmployes(),
    })

    const navigate = useNavigate()

    const rows: EmployeeRow[] =
        users?.data.map((user, index) => ({
            id: page * pageSize + index + 1,
            originalId: user._id,
            imageUrl: user.imageUrl,
            role: user.role,
            phone: user.phone ? (user.phone.startsWith('+') ? user.phone : `+355${user.phone}`) : 'N/A',
            email: user.auth?.email || '',
            fullName: `${user.firstName} ${user.lastName}`,
        })) || []

    const columns = [
        { field: 'id', headerName: 'No', maxWidth: 70, flex: 1 },
        { field: 'fullName', headerName: 'Full Name', width: 150, flex: 1 },
        { field: 'email', headerName: 'Email', width: 150, flex: 1 },
        { field: 'phone', headerName: 'Phone', width: 150, flex: 1 },
        { field: 'role', headerName: 'Role', width: 100, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params: RenderCellParams<EmployeeRow>) => (
                <Link
                    style={{ textDecoration: 'none', color: '#4C556B' }}
                    to={`/profile/${params.row.originalId}`}
                >
                    View More
                </Link>
            ),
        },
    ]
    const getRowId = (row: EmployeeRow) => row.id

    const handleRowClick = (params: { row: EmployeeRow }) => {
        navigate(`/profile/${params.row.originalId}`)
    }

    const contextValue = {
        rows,
        columns,
        getRowId,
        handleRowClick,
        handlePaginationModelChange,
        isPending,
        page,
        pageSize,
        search,
        setSearch,
        totalPages: users?.totalPages ?? 0,
    }

    return (
        <EmployeeContext.Provider value={contextValue}>
            {children}
        </EmployeeContext.Provider>
    )
}
