import { useGetVacations } from '../Hook'
import DataTable from '@/Components/Table/Table'
import { PaginationModel, RenderCellParams } from '@/types/table'
import { dateFormatter } from '@/Helpers/dateFormater'
import style from '../style/vacationTable.module.scss'
import { useContext, useEffect, useState } from 'react'
import { VacationContext } from '../VacationContext'
import { SelectedVacationModal } from './form/SelectedVacationModal'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import Toast from '@/Components/Toast/Toast'
import { Vacation } from '../types'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'

export const VacationTable = () => {
    const {
        searchParams,
        handleOpenViewVacationModalOpen,
        toastConfigs,
        handleToastClose,
    } = useContext(VacationContext)
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebouncedValue(searchInput, 400)
    const { data, error, isPending } = useGetVacations(
        page,
        pageSize,
        debouncedSearch,
    )

    useEffect(() => {
        setPage(0)
    }, [debouncedSearch])

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
    const handlePaginationModelChange = (model: PaginationModel) => {
        setPage(model.page)
        setPageSize(model.pageSize)
    }

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
    const hasSearch = searchInput.trim() !== ''

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mt-5">
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
                    searchPlaceholder="Search by employee, type, or status"
                    actions={
                        <Button
                            btnText="Clear"
                            type={ButtonTypes.SECONDARY}
                            onClick={() => {
                                setSearchInput('')
                                setPage(0)
                            }}
                            disabled={!hasSearch}
                        />
                    }
                />
            </div>
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
