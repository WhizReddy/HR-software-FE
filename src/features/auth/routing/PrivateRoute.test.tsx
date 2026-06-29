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
    SidebarInset: ({
        children,
        className,
    }: {
        children: ReactNode
        className?: string
    }) => (
        <div data-testid="sidebar-inset" className={className}>
            {children}
        </div>
    ),
    SidebarProvider: ({
        children,
        className,
    }: {
        children: ReactNode
        className?: string
    }) => (
        <div data-testid="sidebar-provider" className={className}>
            {children}
        </div>
    ),
}))

describe('PrivateRoute', () => {
    beforeEach(() => {
        authMock.state.isAuthenticated = false
        authMock.state.isInitializing = false
    })

    afterEach(() => {
        cleanup()
        document.body.style.overflow = ''
        document.body.style.overscrollBehavior = ''
        document.body.style.height = ''
        document.documentElement.style.overflow = ''
        document.documentElement.style.overscrollBehavior = ''
        document.documentElement.style.height = ''
        document.documentElement.classList.remove('private-workspace-lock')
    })

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
        expect(document.body.style.overflow).toBe('hidden')
        expect(document.documentElement.style.overflow).toBe('hidden')
        expect(document.body.style.height).toBe('100dvh')
        expect(
            document.documentElement.classList.contains(
                'private-workspace-lock',
            ),
        ).toBe(true)
        expect(screen.getByTestId('sidebar-provider').className).toContain(
            'overflow-hidden',
        )
        expect(screen.getByTestId('sidebar-inset').className).toContain(
            'overflow-hidden',
        )
    })
})
