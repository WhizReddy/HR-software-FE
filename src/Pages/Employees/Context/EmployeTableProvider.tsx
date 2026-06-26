import React from 'react'
import { RenderCellParams } from '@/types/table'
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom'
import {
    EmployeeContext,
    EmployeeRow,
    UserProfileData,
} from '../interfaces/Employe'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import { getReturnState } from '@/Helpers/navigation'
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

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const returnState = React.useMemo(
        () => getReturnState(location),
        [location],
    )
    const {
        searchValue: search,
        setSearchValue: setSearch,
        searchQuery,
        clearSearch,
        resetTableState,
        page,
        pageSize,
        handlePaginationModelChange,
    } = useUrlTableState({
        searchParams,
        setSearchParams,
    })
    const roleFilter = searchParams.get('role') || 'all'

    const setRoleFilter = React.useCallback(
        (role: string) => {
            setSearchParams(
                (prev) => {
                    const nextParams = upsertFilterParams(
                        prev,
                        {
                            role: role === 'all' ? null : role,
                        },
                        { resetPage: true },
                    )

                    return hasSearchParamsChanged(prev, nextParams)
                        ? nextParams
                        : prev
                },
                { replace: true },
            )
        },
        [setSearchParams],
    )

    const resetFilters = React.useCallback(() => {
        resetTableState({ role: null })
    }, [resetTableState])

    const fetchEmployeesPage = async (
        pageToFetch: number,
        limitToFetch: number,
    ): Promise<PaginatedResponse<UserProfileData>> => {
        const params = new URLSearchParams({
            page: String(pageToFetch),
            limit: String(limitToFetch),
        })

        if (searchQuery.trim()) {
            params.set('search', searchQuery)
        }

        if (roleFilter !== 'all') {
            params.set('role', roleFilter)
        }

        const response = await AxiosInstance.get<{
            data: UserProfileData[]
            totalPages: number
            all?: number
        }>(`/user?${params.toString()}`)
        return normalizePaginatedResponse(response.data)
    }

    const matchesEmployeeFilters = (user: UserProfileData) => {
        const fullName = `${user.firstName} ${user.lastName}`
        const matchesRole =
            roleFilter === 'all' ||
            normalizeFilterText(user.role) === normalizeFilterText(roleFilter)

        return (
            matchesRole &&
            matchesSearchText(searchQuery, [
                fullName,
                user.firstName,
                user.lastName,
                user.auth?.email,
                user.phone,
                user.role,
            ])
        )
    }

    const fetchEmployes = async (): Promise<
        Required<PaginatedResponse<UserProfileData>>
    > => {
        const shouldFilterClientSide =
            searchQuery.trim() !== '' || roleFilter !== 'all'

        if (!shouldFilterClientSide) {
            const response = await fetchEmployeesPage(page, pageSize)
            return {
                data: response.data,
                totalPages: response.totalPages ?? 1,
                all: response.all ?? response.data.length,
            }
        }

        const allEmployees =
            await fetchAllPaginatedData<UserProfileData>(fetchEmployeesPage)
        const filteredEmployees = allEmployees.filter(matchesEmployeeFilters)

        return paginateClientRows(filteredEmployees, page, pageSize)
    }

    const {
        data: users,
        isPending,
        isError,
        error,
    } = useQuery<Required<PaginatedResponse<UserProfileData>>, Error>({
        queryKey: ['users', page, pageSize, searchQuery, roleFilter],
        queryFn: () => fetchEmployes(),
    })

    const navigate = useNavigate()

    const rows: EmployeeRow[] =
        users?.data.map((user, index) => ({
            id: page * pageSize + index + 1,
            originalId: user._id,
            imageUrl: user.imageUrl,
            role: user.role,
            phone: user.phone
                ? user.phone.startsWith('+')
                    ? user.phone
                    : `+355${user.phone}`
                : 'N/A',
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
                    state={returnState}
                >
                    View More
                </Link>
            ),
        },
    ]
    const getRowId = (row: EmployeeRow) => row.id

    const handleRowClick = (params: { row: EmployeeRow }) => {
        navigate(`/profile/${params.row.originalId}`, { state: returnState })
    }

    const contextValue = {
        rows,
        columns,
        getRowId,
        handleRowClick,
        handlePaginationModelChange,
        isPending,
        isError,
        error: error ?? null,
        page,
        pageSize,
        search,
        setSearch,
        clearSearch,
        resetFilters,
        hasActiveFilters: search.trim() !== '' || roleFilter !== 'all',
        roleFilter,
        setRoleFilter,
        totalPages: users?.totalPages ?? 0,
    }

    return (
        <EmployeeContext.Provider value={contextValue}>
            {children}
        </EmployeeContext.Provider>
    )
}
