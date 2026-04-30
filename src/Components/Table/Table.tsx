import React from 'react'
import { ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react'
import { ColDef, PaginationModel, RowParams } from '@/types/table'
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
    totalCount?: number
    page: number
    pageSize: number
    onPaginationModelChange: (model: PaginationModel) => void
    title?: string
    actions?: React.ReactNode
    searchValue?: string
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSearchClear?: () => void
    searchPlaceholder?: string
    filterNode?: React.ReactNode
}

function DataTable<TRow>({
    rows,
    columns,
    getRowId,
    handleRowClick,
    totalPages,
    totalCount,
    page,
    pageSize,
    onPaginationModelChange,
    title,
    actions,
    searchValue,
    onSearchChange,
    onSearchClear,
    searchPlaceholder,
    filterNode,
}: DataTableProps<TRow>) {
    const normalizedTotalPages =
        totalPages > 0
            ? totalPages
            : totalCount !== undefined && pageSize > 0
              ? Math.max(1, Math.ceil(totalCount / pageSize))
              : 1
    const canPrev = page > 0
    const canNext =
        totalCount !== undefined && pageSize > 0
            ? (page + 1) * pageSize < totalCount
            : page < normalizedTotalPages - 1
    const hasSearch = Boolean(searchValue?.trim())

    return (
        <Card className="glass-card overflow-hidden border-none p-0 shadow-xl shadow-slate-200/35">
            {(title || actions || onSearchChange || filterNode) && (
                <div className="flex flex-col gap-4 border-b border-slate-100/80 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        {title && (
                            <div className="min-w-0">
                                <h2 className="truncate text-lg font-bold tracking-tight text-slate-800">
                                    {title}
                                </h2>
                            </div>
                        )}
                        {onSearchChange && (
                            <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center">
                                <div className="flex-1">
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
                                {onSearchClear && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onSearchClear}
                                        disabled={!hasSearch}
                                        className="shrink-0"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {(filterNode || actions) && (
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
                            {filterNode}
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className="px-2 pb-2 sm:px-3">
                <Table className="min-w-[760px] text-left text-sm">
                    <TableHeader>
                        <TableRow className="border-b border-slate-200/70 bg-slate-50/70 backdrop-blur-sm hover:bg-slate-50/70">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.field}
                                    className="whitespace-nowrap px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
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
                                    className="py-20 text-center text-sm text-slate-400"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                            <Inbox size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-slate-600">No data to display</p>
                                            <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                                        </div>
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
                                    className={`border-b border-slate-100/50 transition-all duration-300 last:border-0 ${
                                        idx % 2 === 0 ? 'bg-white/40' : 'bg-slate-50/40'
                                    } ${
                                        handleRowClick
                                            ? 'cursor-pointer hover:-translate-y-[1px] hover:bg-blue-50/80 hover:shadow-sm'
                                            : 'hover:bg-slate-50/80'
                                    }`}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.field}
                                            className="whitespace-nowrap px-4 py-4 align-middle text-sm text-slate-700"
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

            <div className="flex flex-col gap-3 border-t border-slate-100/70 bg-white/50 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">
                        Showing {rows.length} {rows.length === 1 ? 'result' : 'results'}
                    </p>
                    <p className="text-xs text-slate-500" aria-live="polite">
                        Page <span className="font-semibold text-slate-700">{page + 1}</span> of{' '}
                        <span className="font-semibold text-slate-700">{normalizedTotalPages}</span>
                    </p>
                </div>

                <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent className="gap-2">
                        <PaginationItem>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canPrev}
                                className="min-w-[92px]"
                                onClick={() =>
                                    onPaginationModelChange({ page: page - 1, pageSize })
                                }
                            >
                                <ChevronLeft size={16} />
                                Prev
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={!canNext}
                                className="min-w-[92px]"
                                onClick={() =>
                                    onPaginationModelChange({ page: page + 1, pageSize })
                                }
                            >
                                Next
                                <ChevronRight size={16} />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Card>
    )
}

export default DataTable
