import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Employees from './Employees'

vi.mock('@/Helpers/Axios', () => ({
    default: {
        get: vi.fn(() => Promise.reject(new Error('Server unavailable'))),
    },
}))

const renderEmployees = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    return render(
        <MemoryRouter
            future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
            <QueryClientProvider client={queryClient}>
                <Employees />
            </QueryClientProvider>
        </MemoryRouter>,
    )
}

describe('Employees page', () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('shows an error banner when the employee query fails', async () => {
        renderEmployees()

        expect(await screen.findByText(/Failed to load employees:/i)).toBeTruthy()
    })
})
