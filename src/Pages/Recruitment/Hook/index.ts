import AxiosInstance from '@/Helpers/Axios'
import { useForm } from '@tanstack/react-form'
import { AxiosError } from 'axios'
import { useContext } from 'react'
import { RecruitmentContext } from '../Context/RecruitmentContext'
import { normalizePhoneNumber } from '../utils/phone'

const getReadableSubmissionError = (payload: unknown) => {
    const message =
        payload && typeof payload === 'object' && 'message' in payload
            ? (payload as { message?: unknown }).message
            : undefined
    const text = Array.isArray(message)
        ? message.filter(Boolean).join(', ')
        : typeof message === 'string'
          ? message
          : ''

    if (text.toLowerCase().includes('invalid phone number')) {
        return 'Enter a valid phone number with digits and an optional country code, for example +355 69 123 4567 or 069 123 4567.'
    }

    return text || null
}

export const useRecruitmentForm = () => {
    const { setError, setShowModal } = useContext(RecruitmentContext)
    const form = useForm<{
        applicationMethod: string
        dob: string
        email: string
        experience: string
        file: FileList | null
        firstName: string
        lastName: string
        phoneNumber: string
        positionApplied: string
        salaryExpectations: string
        technologiesUsed: string[]
    }>({
        defaultValues: {
            applicationMethod: '',
            dob: '',
            email: '',
            experience: '',
            file: null,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            positionApplied: '',
            salaryExpectations: '',
            technologiesUsed: [],
        },
        onSubmit: async ({ value }) => {
            try {
                setError(null)
                const formData = new FormData()
                formData.append('applicationMethod', value.applicationMethod)
                formData.append('dob', value.dob)
                formData.append('email', value.email)
                formData.append('experience', value.experience)
                if (value.file && value.file.length > 0) {
                    formData.append('file', value.file[0])
                }
                formData.append('firstName', value.firstName)
                formData.append('lastName', value.lastName)
                formData.append('phoneNumber', normalizePhoneNumber(value.phoneNumber))
                formData.append('positionApplied', value.positionApplied)
                formData.append('salaryExpectations', value.salaryExpectations)
                formData.append(
                    'technologiesUsed',
                    JSON.stringify(value.technologiesUsed),
                )

                const response = await AxiosInstance.post(
                    '/applicant',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                )
                if ([200, 201].includes(response.status)) {
                    setShowModal(true)
                    return
                }
                setError('Unexpected response while creating your applicant')
            } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    const readableError = getReadableSubmissionError(
                        err.response?.data,
                    )

                    if (readableError) {
                        setError(readableError)
                        return
                    }
                    if (err.code === 'ERR_NETWORK') {
                        setError(
                            'No internet connection. Please try again later.',
                        )
                        return
                    }
                    setError('An error occurred while creating your applicant')
                    return
                }
                setError('An error occurred while creating your applicant')
            }
        },
    })

    return { form }
}
