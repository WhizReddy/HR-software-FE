import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter, useLocation, useSearchParams } from 'react-router-dom'
import { useUrlTableState } from './use-url-table-state'

const LocationSearch = () => {
    const location = useLocation()
    return <div data-testid="location-search">{location.search}</div>
}

const Harness = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { page, pageSize } = useUrlTableState({
        searchParams,
        setSearchParams,
    })

    return (
        <>
            <div data-testid="page">{page}</div>
            <div data-testid="page-size">{pageSize}</div>
            <LocationSearch />
        </>
    )
}

const ResetHarness = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { resetTableState } = useUrlTableState({
        searchParams,
        setSearchParams,
    })

    return (
        <>
            <button
                type="button"
                onClick={() => resetTableState({ role: null })}
            >
                Reset
            </button>
            <LocationSearch />
        </>
    )
}

describe('useUrlTableState', () => {
    afterEach(cleanup)

    it('normalizes invalid page and limit params without removing filters', async () => {
        render(
            <MemoryRouter
                initialEntries={['/employees?page=-1&limit=999&role=admin']}
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                }}
            >
                <Harness />
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.getByTestId('page').textContent).toBe('0')
            expect(screen.getByTestId('page-size').textContent).toBe('5')
        })

        const params = new URLSearchParams(
            screen.getByTestId('location-search').textContent ?? '',
        )
        expect(params.get('page')).toBe('0')
        expect(params.get('limit')).toBe('5')
        expect(params.get('role')).toBe('admin')
    })

    it('clears search and supplied filter params while keeping pagination valid', async () => {
        render(
            <MemoryRouter
                initialEntries={['/employees?page=3&limit=10&search=redi&role=admin']}
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                }}
            >
                <ResetHarness />
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

        await waitFor(() => {
            const params = new URLSearchParams(
                screen.getByTestId('location-search').textContent ?? '',
            )
            expect(params.get('search')).toBeNull()
            expect(params.get('role')).toBeNull()
            expect(params.get('page')).toBe('0')
            expect(params.get('limit')).toBe('10')
        })
    })
})
