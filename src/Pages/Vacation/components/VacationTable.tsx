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
                    <span
                        onClick={() =>
                            handleOpenViewVacationModalOpen(
                                param.value as string,
                            )
                        }
                        className={style.viewButton}
                    >
                        View
                    </span>
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
