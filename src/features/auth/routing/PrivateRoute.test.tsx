import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

vi.mock('../context/AuthProvider', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        isInitializing: false,
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

describe('PrivateRoute', () => {
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
})
