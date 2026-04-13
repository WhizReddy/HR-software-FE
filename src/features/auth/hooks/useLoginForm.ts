import type { Dispatch, SetStateAction } from 'react'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { PublicAxiosInstance } from '@/Helpers/Axios'
import { getApiErrorMessage } from '@/lib/api-error'
import { useAuth } from '../context/AuthProvider'
import type { AuthResponse } from '@/types/api'

export const useLoginForm = (
    setError: Dispatch<SetStateAction<string | null>>,
) => {
    const { login } = useAuth()

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        validatorAdapter: valibotValidator(),
        onSubmit: async ({ value }) => {
            setError(null)
            try {
                const res = await PublicAxiosInstance.post<AuthResponse>(
                    '/auth/signin',
                    value,
                )
                const user = res.data.data.user
                const role = user.role
                const access_token = res.data.data.access_token
                login(access_token, role, user)
            } catch (err: unknown) {
                setError(getApiErrorMessage(err))
            }
        },
    })

    return { form }
}
