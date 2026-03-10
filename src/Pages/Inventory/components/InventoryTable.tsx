import { useContext, useEffect, useState } from 'react'
import { InventoryContext } from '../InventoryContext'
import { useAllInventoryItems } from '../Hook'
import { SingleInventoryItem } from './SingleInventoryItem'
import { InventoryItem } from '../types'
import { Laptop, Monitor } from 'lucide-react'
import DataTable from '@/Components/Table/Table'
import { PaginationModel, RenderCellParams } from '@/types/table'
import { RingLoader } from 'react-spinners'
import {
    ensurePaginationParams,
    hasSearchParamsChanged,
    parseNumberParam,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

export const InventoryTable = () => {
    const { isError, error, data, isPending } = useAllInventoryItems()

    const { handleOpenViewAssetModalOpen, searchParams, setSearchParams } =
        useContext(InventoryContext)
    const [searchInput, setSearchInput] = useState(
        searchParams.get('search') || '',
    )
    const debouncedSearch = useDebouncedValue(searchInput, 400)

    useEffect(() => {
        setSearchParams((prev) => {
            const nextParams = ensurePaginationParams(prev)
            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [setSearchParams])

    useEffect(() => {
        setSearchInput(searchParams.get('search') || '')
    }, [searchParams])

    useEffect(() => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                { search: debouncedSearch.trim() || null },
                { resetPage: true },
            )
            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [debouncedSearch, setSearchParams])

    if (isError) return <div className="p-4 text-red-500">Error: {error.message}</div>

    if (isPending) return (
        <div className="flex justify-center flex-col items-center min-h-[400px]">
            <RingLoader color="#2457A3" />
        </div>
    )

    const rows = data.data.map((asset: InventoryItem, index: number) => ({
        id: asset._id,
        displayId: (Number(searchParams.get('page')) * Number(searchParams.get('limit'))) + index + 1,
        type: asset.type[0].toUpperCase() + asset.type.slice(1),
        occupant: asset.userId,
        status: asset.status,
        serialNumber: asset.serialNumber,
    }))

    const handlePaginationModelChange = (model: PaginationModel) => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(prev, {
                page: model.page.toString(),
                limit: model.pageSize.toString(),
            })
            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }

    const currentPage = parseNumberParam(searchParams, 'page', 0)
    const pageSize = parseNumberParam(searchParams, 'limit', 5)
    const totalPages = data.totalPages || 1

    const columns: any[] = [
        { field: 'displayId', headerName: 'No', width: '80px' },
        {
            field: 'type',
            headerName: 'Type',
            renderCell: (param: RenderCellParams) => (
                <div className="flex items-center gap-2 text-slate-700">
                    {param.value === 'Monitor' ? <Monitor size={18} className="text-slate-400" /> : <Laptop size={18} className="text-slate-400" />}
                    {param.value as string}
                </div>
            )
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
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (param: RenderCellParams) => {
                const status = param.value as string
                return (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                        status === 'assigned' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                )
            }
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
                            newParams.set('selectedInventoryItem', String(param.value))
                            return newParams
                        })
                    }}
                    className="text-primary-blue hover:text-blue-800 font-medium transition-colors hover:underline outline-none"
                >
                    {param.value as string}
                </button>
            )
        }
    ]

    const getRowId = (row: any) => row.id

    return (
        <div className="mt-6">
            <DataTable
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                totalPages={totalPages}
                page={currentPage}
                pageSize={pageSize}
                onPaginationModelChange={handlePaginationModelChange}
                searchValue={searchInput}
                onSearchChange={(e) => setSearchInput(e.target.value)}
                searchPlaceholder="Search inventory..."
            />

            {searchParams.get('selectedInventoryItem') && (
                <SingleInventoryItem />
            )}
        </div>
    )
}
