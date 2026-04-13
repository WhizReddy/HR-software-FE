import { PublicAxiosInstance } from '@/Helpers/Axios'
import { useForm } from '@tanstack/react-form'
import { useContext } from 'react'
import { getApiErrorMessage } from '@/lib/api-error'
import { RecruitmentContext } from '../Context/RecruitmentContext'

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
                formData.append('phoneNumber', value.phoneNumber)
                formData.append('positionApplied', value.positionApplied)
                formData.append('salaryExpectations', value.salaryExpectations)
                formData.append(
                    'technologiesUsed',
                    JSON.stringify(value.technologiesUsed),
                )

                const response = await PublicAxiosInstance.post(
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
                }
            } catch (err: unknown) {
                setError(
                    getApiErrorMessage(
                        err,
                        'An error occurred while creating your applicant',
                    ),
                )
            }
        },
    })

    return { form }
}
