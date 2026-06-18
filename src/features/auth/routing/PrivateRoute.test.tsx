import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

const authMock = vi.hoisted(() => ({
    state: {
        isAuthenticated: false,
        isInitializing: false,
    },
}))

vi.mock('../context/AuthProvider', () => ({
    useAuth: () => ({
        isAuthenticated: authMock.state.isAuthenticated,
        isInitializing: authMock.state.isInitializing,
    }),
}))

vi.mock('@/Components/BreadCrumbs/BreadCrumbs', () => ({
    BreadcrumbComponent: () => <div>Breadcrumbs</div>,
}))

vi.mock('@/Components/Header/header', () => ({
    default: () => <div>Header</div>,
}))

vi.mock('@/Components/SideBar/sidebar', () => ({
    SideBar: () => <div>Sidebar</div>,
}))

vi.mock('@/Components/ui/sidebar', () => ({
    SidebarInset: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
    SidebarProvider: ({ children }: { children: ReactNode }) => (
        <div>{children}</div>
    ),
}))

describe('PrivateRoute', () => {
    beforeEach(() => {
        authMock.state.isAuthenticated = false
        authMock.state.isInitializing = false
    })

    afterEach(cleanup)

    it('redirects logged-out users to the login route', async () => {
        render(
            <MemoryRouter
                initialEntries={['/dashboard']}
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                }}
            >
                <Routes>
                    <Route path="/" element={<div>Login page</div>} />
                    <Route element={<PrivateRoute />}>
                        <Route
                            path="/dashboard"
                            element={<div>Protected dashboard</div>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        )

        expect(await screen.findByText('Login page')).toBeTruthy()
        expect(screen.queryByText('Protected dashboard')).toBeNull()
    })

    it('renders the protected layout for authenticated users', async () => {
        authMock.state.isAuthenticated = true

        render(
            <MemoryRouter
                initialEntries={['/dashboard']}
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                }}
            >
                <Routes>
                    <Route path="/" element={<div>Login page</div>} />
                    <Route element={<PrivateRoute />}>
                        <Route
                            path="/dashboard"
                            element={<div>Protected dashboard</div>}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        )

        expect(await screen.findByText('Sidebar')).toBeTruthy()
        expect(screen.getByText('Header')).toBeTruthy()
        expect(screen.getByText('Breadcrumbs')).toBeTruthy()
        expect(screen.getByText('Protected dashboard')).toBeTruthy()
    })
})
