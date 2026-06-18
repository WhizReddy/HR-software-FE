import { cleanup, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Recruitment from './Recruitment'

vi.mock('./Hook', () => ({
    useRecruitmentForm: () => ({
        form: {
            state: {
                isSubmitting: false,
            },
            reset: vi.fn(),
            handleSubmit: vi.fn(),
            Field: ({
                children,
                name,
            }: {
                name: string
                children: (field: {
                    state: {
                        value: string | string[] | FileList | null
                        meta: { errors: string[] }
                    }
                    handleChange: (value: unknown) => void
                }) => ReactElement
            }) =>
                children({
                    state: {
                        value: name === 'technologiesUsed' ? [] : '',
                        meta: { errors: [] },
                    },
                    handleChange: vi.fn(),
                }),
        },
    }),
}))

describe('Recruitment page', () => {
    afterEach(cleanup)

    it('renders People Hub navigation, required fields, and a real submit button', () => {
        render(
            <MemoryRouter>
                <Recruitment />
            </MemoryRouter>,
        )

        expect(screen.getByText('People Hub')).toBeTruthy()
        expect(
            screen.getByRole('link', { name: /back to careers/i }).getAttribute('href'),
        ).toBe('/career')
        expect(screen.getByLabelText(/first name/i)).toBeTruthy()
        expect(screen.getByLabelText(/phone number/i)).toBeTruthy()
        expect(screen.getByText(/upload your cv/i)).toBeTruthy()
        expect(
            screen.getByRole('button', { name: /reset/i }).getAttribute('type'),
        ).toBe('button')
        expect(
            screen
                .getByRole('button', { name: /submit application/i })
                .getAttribute('type'),
        ).toBe('submit')
    })
})
