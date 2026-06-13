import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import HoldingsProvider from '../../HoldingsContext'
import { AssignAssetModal } from './AssignAssetModal'

const axiosMock = vi.hoisted(() => ({
    get: vi.fn(),
    patch: vi.fn(),
}))

vi.mock('@/Helpers/Axios', () => ({
    default: axiosMock,
}))

const renderAssignAssetModal = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return render(
        <MemoryRouter
            initialEntries={['/holdings?assignItem=true&selectedUser=user-1']}
            future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
            <QueryClientProvider client={queryClient}>
                <HoldingsProvider>
                    <AssignAssetModal />
                </HoldingsProvider>
            </QueryClientProvider>
        </MemoryRouter>,
    )
}

describe('AssignAssetModal', () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('shows the assign button text and available asset options', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'asset-1',
                    type: 'laptop',
                    serialNumber: 'LT-001',
                    status: 'available',
                },
            ],
        })

        renderAssignAssetModal()

        expect(
            await screen.findByRole('button', { name: 'Assign Item' }),
        ).toBeTruthy()
        expect(await screen.findByText('laptop - LT-001')).toBeTruthy()
    })
})
