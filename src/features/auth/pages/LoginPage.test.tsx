import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

const authMock = vi.hoisted(() => ({
    state: {
        isAuthenticated: false,
    },
}))

const loginFormMock = vi.hoisted(() => ({
    handleSubmit: vi.fn(),
    isSubmitting: false,
}))

vi.mock('../context/AuthProvider', () => ({
    useAuth: () => ({
        isAuthenticated: authMock.state.isAuthenticated,
    }),
}))

vi.mock('../hooks/useLoginForm', () => ({
    useLoginForm: () => ({
        form: {
            state: {
                isSubmitting: loginFormMock.isSubmitting,
            },
            handleSubmit: loginFormMock.handleSubmit,
            Field: ({
                children,
            }: {
                children: (field: {
                    state: { value: string; meta: { errors: string[] } }
                    handleChange: (value: string) => void
                }) => ReactElement
            }) =>
                children({
                    state: { value: '', meta: { errors: [] } },
                    handleChange: vi.fn(),
                }),
        },
    }),
}))

const renderLogin = () =>
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>,
    )

describe('LoginPage', () => {
    beforeEach(() => {
        authMock.state.isAuthenticated = false
        loginFormMock.isSubmitting = false
        loginFormMock.handleSubmit.mockReset()
    })

    afterEach(cleanup)

    it('renders People Hub branding and the password recovery link', async () => {
        renderLogin()

        expect(await screen.findAllByText(/people hub/i)).not.toHaveLength(0)
        expect(screen.queryByText(/built for daily hr work/i)).toBeNull()
        expect(
            screen.queryByRole('link', { name: /view open roles/i }),
        ).toBeNull()

        const forgotPasswordLink = screen.getByRole('link', {
            name: /forgot password/i,
        })
        expect(forgotPasswordLink.getAttribute('href')).toBe('/forgot-password')
    })

    it('toggles password visibility and submits through the login form', async () => {
        renderLogin()

        const passwordInput = await screen.findByLabelText(/password/i, {
            selector: 'input',
        })
        expect(passwordInput.getAttribute('type')).toBe('password')

        fireEvent.click(
            screen.getByRole('button', {
                name: /show password/i,
            }),
        )
        expect(
            screen
                .getByLabelText(/password/i, { selector: 'input' })
                .getAttribute('type'),
        ).toBe('text')

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        await waitFor(() => {
            expect(loginFormMock.handleSubmit).toHaveBeenCalledTimes(1)
        })
    })

    it('shows a disabled loading button while login is submitting', async () => {
        loginFormMock.isSubmitting = true

        renderLogin()

        const button = await screen.findByRole('button', {
            name: /signing in/i,
        })
        expect(button.hasAttribute('disabled')).toBe(true)
    })
})
