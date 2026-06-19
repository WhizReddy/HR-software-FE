import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Candidates from './Candidates'

vi.mock('./Context/CandidateTableProvider', () => ({
    CandidateProvider: ({ children }: { children: ReactNode }) => (
        <>{children}</>
    ),
}))

vi.mock('./Context/CandidateTableContext', () => ({
    useCandidateContext: () => ({
        getRowId: (row: { id: number }) => row.id,
        columns: [],
        rows: [],
        handleRowClick: vi.fn(),
        handlePaginationModelChange: vi.fn(),
        totalPages: 1,
        page: 0,
        pageSize: 5,
        isPending: false,
        isError: false,
        error: null,
        search: '',
        setSearch: vi.fn(),
        clearSearch: vi.fn(),
        resetFilters: vi.fn(),
        hasActiveFilters: false,
        statusFilter: 'all',
        setStatusFilter: vi.fn(),
    }),
}))

describe('Candidates page', () => {
    afterEach(cleanup)

    it('does not expose the removed pending status filter', () => {
        render(<Candidates />)

        expect(screen.getByRole('option', { name: /active/i })).toBeTruthy()
        expect(screen.getByRole('option', { name: /rejected/i })).toBeTruthy()
        expect(screen.getByRole('option', { name: /employed/i })).toBeTruthy()
        expect(
            screen.queryByRole('option', { name: /pending/i }),
        ).toBeNull()
    })
})
