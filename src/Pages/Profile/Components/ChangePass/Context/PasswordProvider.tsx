import React, { useState } from 'react'
import { PasswordContext, PasswordContextType } from './PasswordContext'
import AxiosInstance from '../../../../../Helpers/Axios'
import { AxiosError } from 'axios'

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        switch (name) {
            case 'currentPassword':
                setCurrentPassword(value)
                break
            case 'newPassword':
                setNewPassword(value)
                break
            case 'confirmPassword':
                setConfirmPassword(value)
                break
            default:
                break
        }
    }

    const validatePasswords = () => {
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match')
            return false
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long')
            return false
        }
        setError('')
        return true
    }

    const handleUpdatePassword = async (
        event: React.FormEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!validatePasswords()) {
            return
        }

        try {
            const response = await AxiosInstance.post('/auth/updatepassword', {
                oldPassword: currentPassword,
                newPassword,
            })

            if (response.status === 200) {
                setSuccess('Password updated successfully')
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorData = error.response.data
                setError(
                    errorData.message ||
                    'An error occurred while updating the password',
                )
            } else {
                setError('An error occurred while updating the password')
            }
        }
    }

    const contextValue: PasswordContextType = {
        currentPassword,
        newPassword,
        confirmPassword,
        error,
        success,
        handleChange,
        handleUpdatePassword,
    }

    return (
        <PasswordContext.Provider value={contextValue}>
            {children}
        </PasswordContext.Provider>
    )
}
