import { useContext } from 'react'
import { InventoryContext } from '../InventoryContext'
import { useAllInventoryItems } from '../Hook'
import { SingleInventoryItem } from './SingleInventoryItem'
import { InventoryItem } from '../types'
import { Laptop, Monitor } from 'lucide-react'
import DataTable from '@/Components/Table/Table'
import { RenderCellParams } from '@/types/table'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'

export const InventoryTable = () => {
    const { isError, error, data, isPending } = useAllInventoryItems()

    const { handleOpenViewAssetModalOpen, searchParams, setSearchParams } =
        useContext(InventoryContext)
    const {
        searchValue: searchInput,
        setSearchValue: setSearchInput,
        clearSearch,
        resetTableState,
        page: currentPage,
        pageSize,
        handlePaginationModelChange,
    } = useUrlTableState({
        searchParams,
        setSearchParams,
    })
    const statusFilter = searchParams.get('status') || 'all'
    const typeFilter = searchParams.get('type') || 'all'

    const handleFilterChange = (key: string, value: string) => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                {
                    [key]: value === 'all' ? null : value,
                    selectedInventoryItem: null,
                },
                { resetPage: true },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }

    const resetFilters = () => {
        resetTableState({
            status: null,
            type: null,
            selectedInventoryItem: null,
        })
    }

    const hasActiveFilters =
        searchInput.trim() !== '' ||
        statusFilter !== 'all' ||
        typeFilter !== 'all'

    if (isError) {
        return (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                Inventory failed to load: {error.message}
            </div>
        )
    }

    const rows =
        data?.data.map((asset: InventoryItem, index: number) => ({
            id: asset._id,
            displayId: currentPage * pageSize + index + 1,
            type: asset.type[0].toUpperCase() + asset.type.slice(1),
            occupant: asset.userId,
            status: asset.status,
            serialNumber: asset.serialNumber,
        })) ?? []

    const resolvedTotalPages =
        typeof data?.totalPages === 'number' && data.totalPages > 0
            ? data.totalPages
            : typeof data?.all === 'number' && pageSize > 0
              ? Math.max(1, Math.ceil(data.all / pageSize))
              : 1

    const columns: any[] = [
        { field: 'displayId', headerName: 'No', width: '80px' },
        {
            field: 'type',
            headerName: 'Type',
            renderCell: (param: RenderCellParams) => (
                <div className="flex items-center gap-2 text-slate-700">
                    {param.value === 'Monitor' ? (
                        <Monitor size={18} className="text-slate-400" />
                    ) : (
                        <Laptop size={18} className="text-slate-400" />
                    )}
                    {param.value as string}
                </div>
            ),
        },
        {
            field: 'occupant',
            headerName: 'Occupant',
            renderCell: (param: RenderCellParams) => {
                const occupant = param.value as any
                return occupant === null ? (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        N/A
                    </span>
                ) : (
                    <span className="font-medium text-slate-700">
                        {occupant.firstName} {occupant.lastName}
                    </span>
                )
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (param: RenderCellParams) => {
                const status = param.value as string
                return (
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            status === 'available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'assigned'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-800'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                )
            },
        },
        {
            field: 'serialNumber',
            headerName: 'Serial Number',
            renderCell: (param: RenderCellParams) => (
                <button
                    onClick={() => {
                        handleOpenViewAssetModalOpen()
                        setSearchParams((prev) => {
                            const newParams = new URLSearchParams(prev)
                            newParams.set(
                                'selectedInventoryItem',
                                String(param.value),
                            )
                            return newParams
                        })
                    }}
                    className="text-primary-blue hover:text-blue-800 font-medium transition-colors hover:underline outline-none"
                >
                    {param.value as string}
                </button>
            ),
        },
    ]

    const getRowId = (row: any) => row.id

    return (
        <div className="mt-6">
            <DataTable
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                totalPages={resolvedTotalPages}
                page={currentPage}
                pageSize={pageSize}
                onPaginationModelChange={handlePaginationModelChange}
                searchValue={searchInput}
                onSearchChange={(e) => setSearchInput(e.target.value)}
                onSearchClear={clearSearch}
                searchPlaceholder="Search inventory..."
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                exportFileName="inventory"
                exportTitle="Inventory records"
                filterNode={
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-40">
                            Type
                            <select
                                value={typeFilter}
                                onChange={(event) =>
                                    handleFilterChange(
                                        'type',
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/25"
                            >
                                <option value="all">All types</option>
                                <option value="laptop">Laptop</option>
                                <option value="monitor">Monitor</option>
                            </select>
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:w-40">
                            Status
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    handleFilterChange(
                                        'status',
                                        event.target.value,
                                    )
                                }
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium normal-case tracking-normal text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/25"
                            >
                                <option value="all">All statuses</option>
                                <option value="available">Available</option>
                                <option value="assigned">Assigned</option>
                                <option value="broken">Broken</option>
                            </select>
                        </label>
                    </div>
                }
                totalCount={data?.all}
                isLoading={isPending}
                loadingLabel="Loading inventory records..."
            />

            {searchParams.get('selectedInventoryItem') && (
                <SingleInventoryItem />
            )}
        </div>
    )
}
