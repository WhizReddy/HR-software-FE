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

        expect(screen.getByText('No data to display')).toBeTruthy()
        expect(
            screen.getByText('Try adjusting your search or filters.'),
        ).toBeTruthy()
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
})
