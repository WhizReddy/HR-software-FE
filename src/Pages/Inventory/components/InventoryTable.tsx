import { useContext, useEffect } from 'react'
import { InventoryContext } from '../InventoryContext'
import { useAllInventoryItems } from '../Hook'
import { SingleInventoryItem } from './SingleInventoryItem'
import { InventoryItem } from '../types'
import { Laptop, Monitor } from 'lucide-react'
import DataTable from '@/Components/Table/Table'
import { PaginationModel, RenderCellParams } from '@/types/table'
import { RingLoader } from 'react-spinners'

export const InventoryTable = () => {
    const { isError, error, data, isPending } = useAllInventoryItems()

    const { handleOpenViewAssetModalOpen, searchParams, setSearchParams } =
        useContext(InventoryContext)

    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev)
                newParams.set('page', '0')
                newParams.set('limit', '5')
                return newParams
            })
        }
    }, [searchParams, setSearchParams])

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
            const newParams = new URLSearchParams(prev)
            newParams.set('page', model.page.toString())
            newParams.set('limit', model.pageSize.toString())
            return newParams
        })
    }

    const currentPage = Number(searchParams.get('page')) || 0
    const pageSize = Number(searchParams.get('limit')) || 5
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev)
            if (e.target.value) {
                newParams.set('search', e.target.value)
            } else {
                newParams.delete('search')
            }
            newParams.set('page', '0')
            return newParams
        })
    }

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
                searchValue={searchParams.get('search') || ''}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search inventory..."
            />

            {searchParams.get('selectedInventoryItem') && (
                <SingleInventoryItem />
            )}
        </div>
    )
}

