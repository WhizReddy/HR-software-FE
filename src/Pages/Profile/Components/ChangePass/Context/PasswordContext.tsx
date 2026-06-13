import { createContext } from 'react'

export interface PasswordContextType {
    currentPassword: string
    newPassword: string
    confirmPassword: string
    error: string
    success: string
    isUpdatingPassword: boolean
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleUpdatePassword: (
        event: React.FormEvent<HTMLButtonElement>,
    ) => Promise<void>
}

export const PasswordContext = createContext<PasswordContextType | undefined>(
    undefined,
)
