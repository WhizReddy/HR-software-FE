import { PublicAxiosInstance } from '@/Helpers/Axios'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { AxiosError } from 'axios'
import { useAuth } from '@/Context/AuthProvider'
import { Dispatch } from 'react'
import { ApiErrorResponse, AuthResponse } from '@/types/api'

export const useFormLogin = (
    setError: Dispatch<React.SetStateAction<string | null>>,
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
                if (err instanceof AxiosError) {
                    const axiosErr = err as AxiosError<ApiErrorResponse>
                    const message = axiosErr?.response?.data?.message
                    if (message) {
                        setError(Array.isArray(message) ? message[0] : message)
                        return
                    }
                    if (axiosErr.code === 'ERR_NETWORK') {
                        setError(
                            'No internet connection. Please try again later.',
                        )
                        return
                    }
                }
                setError('An error occurred. Please try again later.')
            }
        },
    })

    return { form }
}
