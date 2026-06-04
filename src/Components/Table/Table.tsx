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
    isLoading?: boolean
    loadingLabel?: string
    pageSizeOptions?: number[]
    showPaginationControls?: boolean
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
    isLoading = false,
    loadingLabel = 'Loading records...',
    pageSizeOptions = [5, 10, 20],
    showPaginationControls = true,
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

    const resultLabel =
        totalCount !== undefined
            ? `Showing ${rows.length} of ${totalCount} ${totalCount === 1 ? 'result' : 'results'}`
            : `Showing ${rows.length} ${rows.length === 1 ? 'result' : 'results'}`

    return (
        <Card className="overflow-hidden rounded-lg border border-slate-200/80 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            {(title || actions || onSearchChange || filterNode) && (
                <div className="grid gap-4 border-b border-slate-200/80 bg-white px-5 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        {title && (
                            <div className="min-w-0">
                                <h2 className="truncate text-base font-semibold text-slate-900">
                                    {title}
                                </h2>
                            </div>
                        )}
                        {onSearchChange && (
                            <div className="flex w-full flex-col gap-2 sm:max-w-lg sm:flex-row sm:items-center">
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
                                        height={40}
                                    />
                                </div>
                                {onSearchClear && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={onSearchClear}
                                        disabled={!hasSearch}
                                        className="h-10 shrink-0 rounded-md"
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

            <div className="overflow-x-auto">
                <Table className="min-w-[860px] text-left text-sm">
                    <TableHeader className="sticky top-0 z-10">
                        <TableRow className="border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.field}
                                    className="h-11 whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase text-slate-500"
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    {col.headerName}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: Math.max(3, Math.min(pageSize, 8)) }).map((_, rowIndex) => (
                                <TableRow
                                    key={`loading-row-${rowIndex}`}
                                    className="h-14 border-b border-slate-100 last:border-0"
                                >
                                    {columns.map((col, colIndex) => (
                                        <TableCell
                                            key={`${col.field}-${rowIndex}`}
                                            className="px-5 py-3"
                                        >
                                            <div
                                                className={`h-4 animate-pulse rounded bg-slate-100 ${
                                                    colIndex === 0
                                                        ? 'w-12'
                                                        : colIndex === columns.length - 1
                                                          ? 'w-20'
                                                          : 'w-32'
                                                }`}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : rows.length === 0 ? (
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
                                    className={`h-14 border-b border-slate-100 transition-colors duration-200 last:border-0 ${
                                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                                    } ${
                                        handleRowClick
                                            ? 'cursor-pointer hover:bg-blue-50/60'
                                            : 'hover:bg-slate-50'
                                    }`}
                                >
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.field}
                                            className="whitespace-nowrap px-5 py-3 align-middle text-sm text-slate-700"
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

            <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">
                        {isLoading ? loadingLabel : resultLabel}
                    </p>
                    {showPaginationControls && (
                        <p className="text-xs text-slate-500" aria-live="polite">
                            Page <span className="font-semibold text-slate-700">{page + 1}</span> of{' '}
                            <span className="font-semibold text-slate-700">{normalizedTotalPages}</span>
                        </p>
                    )}
                </div>

                {showPaginationControls && (
                    <Pagination className="mx-0 w-auto justify-end">
                        <PaginationContent className="flex-wrap gap-2">
                            <PaginationItem>
                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    Rows
                                    <select
                                        value={pageSize}
                                        disabled={isLoading}
                                        onChange={(event) =>
                                            onPaginationModelChange({
                                                page: 0,
                                                pageSize: Number(event.target.value),
                                            })
                                        }
                                        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#2457a3] focus:ring-2 focus:ring-[#2457a3]/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                        {pageSizeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading || !canPrev}
                                    className="min-w-[92px] rounded-md"
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
                                    disabled={isLoading || !canNext}
                                    className="min-w-[92px] rounded-md"
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
                )}
            </div>
        </Card>
    )
}

export default DataTable
