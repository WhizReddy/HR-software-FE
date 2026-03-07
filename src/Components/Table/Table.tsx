import React from 'react'
import { ColDef, PaginationModel, RowParams } from '@/types/table'
import { Search } from 'lucide-react'
import Input from '@/Components/Input/Index'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table'
import { Card } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Pagination, PaginationContent, PaginationItem } from '@/Components/ui/pagination'

interface DataTableProps<TRow> {
    rows: TRow[]
    columns: ColDef<TRow>[]
    getRowId: (row: TRow) => number | string
    handleRowClick?: (params: RowParams<TRow>) => void
    totalPages: number
    page: number
    pageSize: number
    onPaginationModelChange: (model: PaginationModel) => void
    title?: string
    actions?: React.ReactNode
    searchValue?: string
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    searchPlaceholder?: string
    filterNode?: React.ReactNode
}

function DataTable<TRow>({
    rows,
    columns,
    getRowId,
    handleRowClick,
    totalPages,
    page,
    pageSize,
    onPaginationModelChange,
    title,
    actions,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    filterNode,
}: DataTableProps<TRow>) {
    const canPrev = page > 0
    const canNext = page < totalPages - 1
    const normalizedTotalPages = totalPages || 1

    return (
        <Card className="glass-card overflow-hidden border-none p-0">
            {/* Optional header row */}
            {(title || actions || onSearchChange || filterNode) && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-b border-slate-100 gap-4">
                    <div className="flex items-center w-full sm:w-auto gap-4 flex-1">
                        {title && <h2 className="font-bold text-slate-800 text-lg tracking-tight whitespace-nowrap">{title}</h2>}
                        {onSearchChange && (
                            <div className="w-full sm:max-w-xs">
                                <Input
                                    IsUsername
                                    type="search"
                                    name="table-search"
                                    placeholder={searchPlaceholder}
                                    label={undefined}
                                    value={searchValue || ''}
                                    onChange={onSearchChange}
                                    iconPosition="start"
                                    icon={<Search size={18} className="text-slate-400" />}
                                    width="100%"
                                />
                            </div>
                        )}
                    </div>
                    {(filterNode || actions) && (
                        <div className="flex items-center w-full sm:w-auto gap-3 justify-end">
                            {filterNode}
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className="w-full overflow-x-auto px-2">
                <Table className="w-full text-left text-sm">
                    <TableHeader>
                        <TableRow className="border-b border-slate-200/60 bg-slate-50/50 backdrop-blur-sm hover:bg-slate-50/50">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.field}
                                    className="whitespace-nowrap px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    {col.headerName}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center py-16 text-slate-400 text-sm"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-2xl">📭</span>
                                        <span>No data to display</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, idx) => (
                                <TableRow
                                    key={getRowId(row)}
                                    onClick={() =>
                                        handleRowClick && handleRowClick({ row })
                                    }
                                    className={`border-b border-slate-100/50 transition-all duration-300 last:border-0 ${idx % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'
                                        } ${handleRowClick
                                            ? 'hover:bg-blue-50/80 hover:shadow-sm cursor-pointer hover:-translate-y-[1px]'
                                            : 'hover:bg-slate-50/80'
                                        }`}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.field}
                                            className="whitespace-nowrap px-3 py-3.5 text-sm text-slate-700"
                                        >
                                            {col.renderCell
                                                ? col.renderCell({
                                                    value: (row as Record<string, unknown>)[col.field],
                                                    row,
                                                    field: col.field,
                                                })
                                                : String((row as Record<string, unknown>)[col.field] ?? '')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 bg-white/40 backdrop-blur-md border-t border-slate-100/50 rounded-b-3xl">
                <p className="text-xs text-slate-500">
                    Page{' '}
                    <span className="font-semibold text-slate-700">{page + 1}</span>
                    {' '}of{' '}
                    <span className="font-semibold text-slate-700">{normalizedTotalPages}</span>
                </p>

                <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canPrev}
                                onClick={() =>
                                    onPaginationModelChange({ page: page - 1, pageSize })
                                }
                            >
                                Prev
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canNext}
                                onClick={() =>
                                    onPaginationModelChange({ page: page + 1, pageSize })
                                }
                            >
                                Next
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Card>
    )
}

export default DataTable
