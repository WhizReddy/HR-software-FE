import React from 'react'
import { RenderCellParams } from '@/types/table'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { EmployeeContext, EmployeeRow, UserProfileData } from '../interfaces/Employe'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { useUrlTableState } from '@/hooks/use-url-table-state'

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
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

    const fetchEmployes = async () => {
        const response = await AxiosInstance.get<{ data: UserProfileData[], totalPages: number }>(`/user?page=${page}&limit=${pageSize}&search=${searchQuery}`)
        return response.data
    }

    const { data: users, isPending } = useQuery<{ data: UserProfileData[]; totalPages: number }, Error>({
        queryKey: ['users', page, pageSize, searchQuery],
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
        clearSearch,
        totalPages: users?.totalPages ?? 0,
    }

    return (
        <EmployeeContext.Provider value={contextValue}>
            {children}
        </EmployeeContext.Provider>
    )
}
