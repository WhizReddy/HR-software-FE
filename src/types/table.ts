export interface ColDef<TRow = Record<string, unknown>> {
    field: string
    headerName: string
    width?: number
    flex?: number
    maxWidth?: number
    renderCell?: (params: RenderCellParams<TRow>) => React.ReactNode
}

export interface RenderCellParams<TRow = Record<string, unknown>> {
    value: unknown
    row: TRow
    field: string
}

export interface PaginationModel {
    page: number
    pageSize: number
}

export interface RowParams<TRow = Record<string, unknown>> {
    row: TRow
}
