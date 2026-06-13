import { useGetVacations } from '../Hook'
import DataTable from '@/Components/Table/Table'
import { RenderCellParams } from '@/types/table'
import { dateFormatter } from '@/Helpers/dateFormater'
import style from '../style/vacationTable.module.scss'
import { useContext } from 'react'
import { VacationContext } from '../VacationContext'
import { SelectedVacationModal } from './form/SelectedVacationModal'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import Toast from '@/Components/Toast/Toast'
import { Vacation } from '../types'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'

export const VacationTable = () => {
    const {
        searchParams,
        setSearchParams,
        handleOpenViewVacationModalOpen,
        toastConfigs,
        handleToastClose,
    } = useContext(VacationContext)
    const {
        searchValue: searchInput,
        setSearchValue: setSearchInput,
        searchQuery,
        clearSearch,
        resetTableState,
        page,
        pageSize,
        handlePaginationModelChange,
    } = useUrlTableState({
        searchParams,
        setSearchParams,
        searchKey: 'requestSearch',
        pageKey: 'requestPage',
        limitKey: 'requestLimit',
    })
    const statusFilter = searchParams.get('requestStatus') || 'all'
    const typeFilter = searchParams.get('requestType') || 'all'

    const handleFilterChange = (key: string, value: string) => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                {
                    [key]: value === 'all' ? null : value,
                    selectedVacation: null,
                },
                {
                    resetPage: true,
                    pageKey: 'requestPage',
                    limitKey: 'requestLimit',
                },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }

    const resetFilters = () => {
        resetTableState({
            requestStatus: null,
            requestType: null,
            selectedVacation: null,
        })
    }

    const hasActiveFilters =
        searchInput.trim() !== '' ||
        statusFilter !== 'all' ||
        typeFilter !== 'all'

    const { data, error, isPending } = useGetVacations(
        page,
        pageSize,
        searchQuery,
        statusFilter === 'all' ? '' : statusFilter,
        typeFilter === 'all' ? '' : typeFilter,
    )

    if (error) {
        return (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                Vacation requests failed to load: {error.message}
            </div>
        )
    }

    const rows =
        data?.data.map((vacation: Vacation) => ({
            id: vacation._id,
            fullName: `${vacation.userId?.firstName} ${vacation.userId?.lastName}`,
            type: vacation.type,
            status: vacation.status,
            startDate: vacation.startDate,
            endDate: vacation.endDate,
            actions: vacation._id,
        })) ?? []
    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'fullName', headerName: 'Full Name', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: ({ value }: RenderCellParams) => {
                const color =
                    value === 'pending'
                        ? 'orange'
                        : value === 'accepted'
                          ? 'green'
                          : value === 'rejected'
                            ? 'red'
                            : ''
                return <StatusBadge color={color} status={value as string} />
            },
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 1,
            renderCell: (param: RenderCellParams) =>
                dateFormatter(param.value as string),
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 1,
            renderCell: (param: RenderCellParams) =>
                dateFormatter(param.value as string),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (param: RenderCellParams) => {
                return (
                    <button
                        type="button"
                        aria-label="View vacation request"
                        onClick={() =>
                            handleOpenViewVacationModalOpen(
                                param.value as string,
                            )
                        }
                        className={style.viewButton}
                    >
                        View
                    </button>
                )
            },
        },
    ]

    const getRowId = (row: { id: number | string }) => row.id

    return (
        <>
            <DataTable
                onPaginationModelChange={handlePaginationModelChange}
                page={page}
                pageSize={pageSize}
                totalPages={data?.totalPages ?? 0}
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                title="Vacation requests"
                searchValue={searchInput}
                onSearchChange={(e) => setSearchInput(e.target.value)}
                onSearchClear={clearSearch}
                searchPlaceholder="Search by employee, type, or status"
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                exportFileName="vacation-requests"
                exportTitle="Vacation requests"
                filterNode={
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-40">
                            Status
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    handleFilterChange(
                                        'requestStatus',
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-[#2457a3] focus:outline-none focus:ring-2 focus:ring-[#2457a3]/20"
                            >
                                <option value="all">All statuses</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-40">
                            Type
                            <select
                                value={typeFilter}
                                onChange={(event) =>
                                    handleFilterChange(
                                        'requestType',
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-[#2457a3] focus:outline-none focus:ring-2 focus:ring-[#2457a3]/20"
                            >
                                <option value="all">All types</option>
                                <option value="vacation">Vacation</option>
                                <option value="sick">Sick</option>
                                <option value="personal">Personal</option>
                                <option value="maternity">Maternity</option>
                            </select>
                        </label>
                    </div>
                }
                isLoading={isPending}
                loadingLabel="Loading vacation requests..."
            />
            {searchParams.get('selectedVacation') && <SelectedVacationModal />}
            <Toast
                open={toastConfigs.isOpen}
                onClose={handleToastClose}
                message={toastConfigs.message || ''}
                severity={toastConfigs.severity}
            />
        </>
    )
}
