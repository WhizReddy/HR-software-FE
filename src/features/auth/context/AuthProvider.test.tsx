import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthProvider'

vi.mock('@/Helpers/Axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({ data: { status: 'ok' } })),
    },
}))

const createFutureToken = () =>
    `header.${btoa(
        JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 * 60 }),
    )}.signature`

const AuthState = () => {
    const { isAuthenticated, isInitializing } = useAuth()

    if (isInitializing) {
        return <div>initializing</div>
    }

    return <div>{isAuthenticated ? 'authenticated' : 'guest'}</div>
}

describe('AuthProvider', () => {
    afterEach(() => {
        cleanup()
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('clears the stored session when a logout event is dispatched', async () => {
        localStorage.setItem('access_token', createFutureToken())
        localStorage.setItem('user_role', 'admin')
        localStorage.setItem(
            'user',
            JSON.stringify({
                _id: 'user-1',
                firstName: 'Test',
                lastName: 'User',
                role: 'admin',
            }),
        )

        render(
            <AuthProvider>
                <AuthState />
            </AuthProvider>,
        )

        expect(await screen.findByText('authenticated')).toBeTruthy()

        window.dispatchEvent(new Event('auth:logout'))

        await waitFor(() => {
            expect(screen.getByText('guest')).toBeTruthy()
            expect(localStorage.getItem('access_token')).toBeNull()
            expect(localStorage.getItem('user_role')).toBeNull()
            expect(localStorage.getItem('user')).toBeNull()
        })
    })
})
