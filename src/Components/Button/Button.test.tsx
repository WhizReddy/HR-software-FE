import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { FormEvent } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from './Button'
import { ButtonTypes } from './ButtonTypes'

describe('Button', () => {
    afterEach(cleanup)

    it('renders a primary button and calls onClick', () => {
        const onClick = vi.fn()

        render(
            <Button
                type={ButtonTypes.PRIMARY}
                btnText="Save"
                onClick={onClick}
            />,
        )

        fireEvent.click(screen.getByRole('button', { name: /save/i }))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
        const onClick = vi.fn()

        render(<Button btnText="Disabled" onClick={onClick} disabled />)

        fireEvent.click(screen.getByRole('button', { name: /disabled/i }))

        expect(onClick).not.toHaveBeenCalled()
    })

    it('uses button type by default and supports submit behavior explicitly', () => {
        const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()
        })

        const { rerender } = render(
            <form onSubmit={onSubmit}>
                <Button btnText="Default Action" />
            </form>,
        )

        const defaultButton = screen.getByRole('button', {
            name: /default action/i,
        })
        expect(defaultButton.getAttribute('type')).toBe('button')

        fireEvent.click(defaultButton)
        expect(onSubmit).not.toHaveBeenCalled()

        rerender(
            <form onSubmit={onSubmit}>
                <Button btnText="Submit Action" htmlType="submit" />
            </form>,
        )

        fireEvent.click(screen.getByRole('button', { name: /submit action/i }))
        expect(onSubmit).toHaveBeenCalledTimes(1)

        rerender(
            <form onSubmit={onSubmit}>
                <Button btnText="Legacy Submit" isSubmit />
            </form>,
        )

        fireEvent.click(screen.getByRole('button', { name: /legacy submit/i }))
        expect(onSubmit).toHaveBeenCalledTimes(2)
    })
})
