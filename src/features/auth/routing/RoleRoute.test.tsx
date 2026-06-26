import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RoleRoute from './RoleRoute'

const authMock = vi.hoisted(() => ({
    state: {
        currentUser: { _id: 'user-1', role: 'dev' },
        isAuthenticated: true,
        isInitializing: false,
        userRole: 'dev',
    },
}))

vi.mock('../context/AuthProvider', () => ({
    useAuth: () => ({
        currentUser: authMock.state.currentUser,
        isAuthenticated: authMock.state.isAuthenticated,
        isInitializing: authMock.state.isInitializing,
        userRole: authMock.state.userRole,
    }),
}))

describe('RoleRoute', () => {
    beforeEach(() => {
        authMock.state.currentUser = { _id: 'user-1', role: 'dev' }
        authMock.state.isAuthenticated = true
        authMock.state.isInitializing = false
        authMock.state.userRole = 'dev'
    })

    afterEach(cleanup)

    it('redirects normal users away from HR-only routes to My Assets', async () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/holdings" element={<div>My Assets</div>} />
                    <Route
                        path="/dashboard"
                        element={
                            <RoleRoute allowedRoles={['admin', 'hr']}>
                                <div>HR dashboard</div>
                            </RoleRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(await screen.findByText('My Assets')).toBeTruthy()
        expect(screen.queryByText('HR dashboard')).toBeNull()
    })

    it('allows normal users to open their own self-service route', async () => {
        render(
            <MemoryRouter initialEntries={['/profile/user-1']}>
                <Routes>
                    <Route path="/holdings" element={<div>My Assets</div>} />
                    <Route
                        path="/profile/:id"
                        element={
                            <RoleRoute
                                allowedRoles={['admin', 'hr']}
                                allowSelfParam="id"
                            >
                                <div>My Profile</div>
                            </RoleRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(await screen.findByText('My Profile')).toBeTruthy()
        expect(screen.queryByText('My Assets')).toBeNull()
    })
})
