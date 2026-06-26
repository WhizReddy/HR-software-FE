import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DataTable from './Table'
import { ColDef } from '@/types/table'

type PersonRow = {
    id: string
    name: string
}

const columns: ColDef<PersonRow>[] = [{ field: 'name', headerName: 'Name' }]
const emptyRows: PersonRow[] = []

describe('DataTable', () => {
    afterEach(cleanup)

    it('renders loading and empty states clearly', () => {
        const { rerender } = render(
            <DataTable
                rows={emptyRows}
                columns={columns}
                getRowId={(row) => String(row.name)}
                totalPages={1}
                page={0}
                pageSize={5}
                onPaginationModelChange={() => undefined}
                isLoading
                loadingLabel="Loading people..."
            />,
        )

        expect(screen.getByText('Loading people...')).toBeTruthy()

        rerender(
            <DataTable
                rows={emptyRows}
                columns={columns}
                getRowId={(row) => String(row.name)}
                totalPages={1}
                page={0}
                pageSize={5}
                onPaginationModelChange={() => undefined}
            />,
        )

        expect(screen.getByText('No records yet')).toBeTruthy()
        expect(
            screen.getByText(
                'New records will appear here when they are available.',
            ),
        ).toBeTruthy()
    })

    it('shows reset controls when filters are active', () => {
        const onResetFilters = vi.fn()

        render(
            <DataTable
                rows={emptyRows}
                columns={columns}
                getRowId={(row) => String(row.name)}
                totalPages={1}
                page={0}
                pageSize={5}
                onPaginationModelChange={() => undefined}
                onResetFilters={onResetFilters}
                hasActiveFilters
            />,
        )

        expect(screen.getByText('No matching records')).toBeTruthy()
        fireEvent.click(
            screen.getAllByRole('button', { name: /reset filters/i })[0],
        )

        expect(onResetFilters).toHaveBeenCalledTimes(1)
    })

    it('calls pagination changes with the next page', () => {
        const onPaginationModelChange = vi.fn()

        render(
            <DataTable
                rows={[{ id: '1', name: 'Redi' }]}
                columns={columns}
                getRowId={(row) => String(row.id)}
                totalPages={2}
                page={0}
                pageSize={5}
                onPaginationModelChange={onPaginationModelChange}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: /next/i }))

        expect(onPaginationModelChange).toHaveBeenCalledWith({
            page: 1,
            pageSize: 5,
        })
    })

    it('lets rows use page scroll instead of a nested vertical table scroll', () => {
        const { container } = render(
            <DataTable
                rows={[{ id: '1', name: 'Redi' }]}
                columns={columns}
                getRowId={(row) => String(row.id)}
                totalPages={1}
                page={0}
                pageSize={5}
                onPaginationModelChange={() => undefined}
            />,
        )

        const tableScrollContainer = container.querySelector(
            '.overflow-x-auto',
        )

        expect(tableScrollContainer).toBeTruthy()
        expect(tableScrollContainer?.className).toContain('overflow-y-visible')
        expect(tableScrollContainer?.className).not.toContain('max-h-[72vh]')
    })

    it('keeps export controls aligned without helper copy', () => {
        render(
            <DataTable
                rows={[{ id: '1', name: 'Redi' }]}
                columns={columns}
                getRowId={(row) => String(row.id)}
                totalPages={1}
                page={0}
                pageSize={5}
                onPaginationModelChange={() => undefined}
                exportFileName="people"
            />,
        )

        expect(screen.getByRole('button', { name: /csv/i })).toBeTruthy()
        expect(screen.getByRole('button', { name: /print/i })).toBeTruthy()
        expect(screen.queryByRole('button', { name: /pdf/i })).toBeNull()
        expect(screen.queryByText('Exports current table view.')).toBeNull()
    })
})
