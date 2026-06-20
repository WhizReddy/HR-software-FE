import React from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Inbox,
    Printer,
    RotateCcw,
    Search,
} from 'lucide-react'
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
    exportFileName?: string
    exportTitle?: string
    onResetFilters?: () => void
    hasActiveFilters?: boolean
    emptyTitle?: string
    emptyDescription?: string
}

const normalizeExportValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return ''
    }

    if (value instanceof Date) {
        return value.toISOString()
    }

    if (Array.isArray(value)) {
        return value.map(normalizeExportValue).join('; ')
    }

    if (typeof value === 'object') {
        const objectValue = value as Record<string, unknown>
        if (objectValue.firstName || objectValue.lastName) {
            return [objectValue.firstName, objectValue.lastName]
                .filter(Boolean)
                .join(' ')
        }

        return JSON.stringify(value)
    }

    return String(value)
}

const escapeCsvCell = (value: string) => {
    const escaped = value.replace(/"/g, '""')
    return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')

const getExportColumns = <TRow,>(columns: ColDef<TRow>[]) =>
    columns.filter((column) => column.field !== 'actions')

const getExportRows = <TRow,>(rows: TRow[], columns: ColDef<TRow>[]) =>
    rows.map((row) =>
        columns.map((column) =>
            normalizeExportValue((row as Record<string, unknown>)[column.field]),
        ),
    )

const tableControlButtonClass =
    'h-10 w-full justify-center rounded-md sm:w-auto'

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
    exportFileName,
    exportTitle,
    onResetFilters,
    hasActiveFilters,
    emptyTitle,
    emptyDescription,
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
    const hasActiveTableFilters = hasActiveFilters ?? hasSearch
    const canExport = Boolean(exportFileName) && rows.length > 0
    const exportedColumns = getExportColumns(columns)
    const resolvedExportTitle = exportTitle || title || 'Table export'
    const resolvedEmptyTitle =
        emptyTitle ||
        (hasActiveTableFilters ? 'No matching records' : 'No records yet')
    const resolvedEmptyDescription =
        emptyDescription ||
        (hasActiveTableFilters
            ? 'Reset filters or try a different search to widen the results.'
            : 'New records will appear here when they are available.')

    const resultLabel =
        totalCount !== undefined
            ? `Showing ${rows.length} of ${totalCount} ${totalCount === 1 ? 'result' : 'results'}`
            : `Showing ${rows.length} ${rows.length === 1 ? 'result' : 'results'}`

    const handleCsvExport = () => {
        if (!canExport) return

        const headerRow = exportedColumns.map((column) =>
            escapeCsvCell(column.headerName),
        )
        const bodyRows = getExportRows(rows, exportedColumns).map((row) =>
            row.map(escapeCsvCell),
        )
        const csv = [headerRow, ...bodyRows]
            .map((row) => row.join(','))
            .join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${exportFileName}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handlePrintExport = () => {
        if (!canExport) return

        const printWindow = window.open('', '_blank', 'width=960,height=720')
        if (!printWindow) return

        const headerCells = exportedColumns
            .map(
                (column) =>
                    `<th>${escapeHtml(column.headerName)}</th>`,
            )
            .join('')
        const bodyRows = getExportRows(rows, exportedColumns)
            .map(
                (row) =>
                    `<tr>${row
                        .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                        .join('')}</tr>`,
            )
            .join('')

        printWindow.document.write(`
            <!doctype html>
            <html>
                <head>
                    <title>${escapeHtml(resolvedExportTitle)}</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #0f172a; margin: 24px; }
                        h1 { font-size: 20px; margin: 0 0 16px; }
                        table { width: 100%; border-collapse: collapse; font-size: 12px; }
                        th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; vertical-align: top; }
                        th { background: #f8fafc; color: #475569; text-transform: uppercase; font-size: 11px; }
                    </style>
                </head>
                <body>
                    <h1>${escapeHtml(resolvedExportTitle)}</h1>
                    <table>
                        <thead><tr>${headerCells}</tr></thead>
                        <tbody>${bodyRows}</tbody>
                    </table>
                </body>
            </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
    }

    const exportControls = exportFileName ? (
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCsvExport}
                disabled={!canExport || isLoading}
                className={tableControlButtonClass}
            >
                <Download size={16} />
                CSV
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrintExport}
                disabled={!canExport || isLoading}
                className={tableControlButtonClass}
            >
                <Printer size={16} />
                PDF
            </Button>
        </div>
    ) : null

    const resetControls = onResetFilters ? (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            disabled={!hasActiveTableFilters || isLoading}
            className={`${tableControlButtonClass} sm:min-w-[132px]`}
        >
            <RotateCcw size={16} />
            Reset filters
        </Button>
    ) : null

    return (
        <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-none">
            {(title ||
                actions ||
                onSearchChange ||
                filterNode ||
                exportControls ||
                resetControls) && (
                <div className="grid gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <div className="flex w-full flex-1 flex-col gap-3 sm:flex-row sm:items-end">
                        {title && (
                            <div className="min-w-0 pb-2">
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
                                        className={`${tableControlButtonClass} sm:shrink-0`}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {(filterNode || actions || exportControls || resetControls) && (
                        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-end lg:w-auto">
                            {filterNode && (
                                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
                                    {filterNode}
                                </div>
                            )}
                            {(resetControls || exportControls || actions) && (
                                <div className="grid w-full gap-2 sm:flex sm:w-auto sm:items-center">
                                    {resetControls}
                                    {exportControls}
                                    {actions}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="max-h-[72vh] overflow-auto">
                <Table className="min-w-[860px] text-left text-sm">
                    <TableHeader className="sticky top-0 z-20 shadow-[0_1px_0_rgba(226,232,240,0.9)]">
                        <TableRow className="border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                            {columns.map((col) => (
                                <TableHead
                                    key={col.field}
                                    className="h-11 whitespace-nowrap px-5 py-3 text-[13px] font-semibold text-slate-500"
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
                                            <p className="font-semibold text-slate-600">
                                                {resolvedEmptyTitle}
                                            </p>
                                            <p className="mx-auto max-w-sm text-xs leading-5 text-slate-400">
                                                {resolvedEmptyDescription}
                                            </p>
                                        </div>
                                        {onResetFilters && hasActiveTableFilters && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={onResetFilters}
                                                className="mt-1 rounded-md"
                                            >
                                                <RotateCcw size={16} />
                                                Reset filters
                                            </Button>
                                        )}
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
                                            ? 'cursor-pointer hover:bg-slate-50'
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

            <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
                    <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                        <PaginationContent className="w-full flex-wrap gap-2 sm:w-auto">
                            <PaginationItem className="w-full sm:w-auto">
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
                                        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                    >
                                        {pageSizeOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </PaginationItem>
                            <PaginationItem className="flex flex-1 sm:block sm:flex-none">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading || !canPrev}
                                    className="min-w-[92px] flex-1 rounded-md sm:flex-none"
                                    onClick={() =>
                                        onPaginationModelChange({ page: page - 1, pageSize })
                                    }
                                >
                                    <ChevronLeft size={16} />
                                    Prev
                                </Button>
                            </PaginationItem>
                            <PaginationItem className="flex flex-1 sm:block sm:flex-none">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading || !canNext}
                                    className="min-w-[92px] flex-1 rounded-md sm:flex-none"
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
