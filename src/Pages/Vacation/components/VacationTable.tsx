import { useGetVacations } from '../Hook'
import DataTable from '@/Components/Table/Table'
import { RenderCellParams } from '@/types/table'
import { dateFormatter } from '@/Helpers/dateFormater'
import { useContext } from 'react'
import { VacationContext } from '../VacationContext'
import { SelectedVacationModal } from './form/SelectedVacationModal'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import Toast from '@/Components/Toast/Toast'
import { Vacation } from '../types'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import {
    formatVacationType,
    getVacationDurationDays,
    getVacationStatusColor,
} from '../utils'

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
    const { data, error, isPending } = useGetVacations(
        page,
        pageSize,
        searchQuery,
    )

    if (error) return <p>Error: {error.message}</p>
    if (isPending) return <div className="flex justify-center p-4"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>

    const rows =
        data?.data.map((vacation: Vacation) => ({
            id: vacation._id,
            fullName:
                `${vacation.userId?.firstName ?? ''} ${vacation.userId?.lastName ?? ''}`.trim() ||
                'Unknown employee',
            type: vacation.type,
            status: vacation.status,
            startDate: vacation.startDate,
            endDate: vacation.endDate,
            duration: getVacationDurationDays(
                vacation.startDate,
                vacation.endDate,
            ),
            description: vacation.description,
            actions: vacation._id,
        })) ?? []
    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'fullName', headerName: 'Full Name', flex: 1 },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            renderCell: ({ value }: RenderCellParams) =>
                formatVacationType(value as Vacation['type']),
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: ({ value }: RenderCellParams) => {
                return (
                    <StatusBadge
                        color={getVacationStatusColor(
                            value as Vacation['status'],
                        )}
                        status={value as string}
                    />
                )
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
            field: 'duration',
            headerName: 'Days',
            width: 110,
            renderCell: ({ value }: RenderCellParams) => (
                <span className="font-medium text-slate-700">
                    {value as number} day{value === 1 ? '' : 's'}
                </span>
            ),
        },
        {
            field: 'actions',
            headerName: 'Details',
            width: 120,
            renderCell: (param: RenderCellParams) => {
                return (
                    <button
                        type="button"
                        onClick={() =>
                            handleOpenViewVacationModalOpen(
                                param.value as string,
                            )
                        }
                        className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-[#2457a3] transition hover:bg-blue-50 hover:text-[#17345d]"
                    >
                        Review
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
                title="Vacation Request Queue"
                searchValue={searchInput}
                onSearchChange={(e) => setSearchInput(e.target.value)}
                onSearchClear={clearSearch}
                searchPlaceholder="Search by employee, leave type, or status"
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
