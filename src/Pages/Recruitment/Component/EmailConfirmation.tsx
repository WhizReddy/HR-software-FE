import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AxiosInstance from '../../../Helpers/Axios'
import { usePageMeta } from '@/hooks/use-page-meta'

const EmailConfirmation: React.FC = () => {
    usePageMeta({
        title: 'Confirm Application | People Hub',
        description:
            'Confirm your People Hub recruitment application email address.',
    })

    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const token = query.get('token')
    const [status, setStatus] = useState<'confirming' | 'success' | 'error'>(
        'confirming',
    )
    const navigate = useNavigate()

    useEffect(() => {
        const confirm = async () => {
            if (token) {
                try {
                    const confirmationUrl = `/applicant/confirm?token=${token}&status=success`
                    const response = await AxiosInstance.get(confirmationUrl)

                    if (response.status === 200) {
                        setStatus('success')
                    } else {
                        setStatus('error')
                    }
                } catch (error) {
                    console.error('Error confirming application:', error)
                    setStatus('error')
                }
            } else {
                setStatus('error')
            }
        }

        confirm()
    }, [navigate, token])

    useEffect(() => {
        if (status === 'success') {
            setTimeout(() => {
                navigate('/career')
            }, 3000)
        }
    }, [status, navigate])

    if (status === 'confirming') {
        return <div>Confirming your application...</div>
    }

    if (status === 'success') {
        return (
            <div>
                <h1>Confirmation Successful!</h1>
                <p>
                    Your application has been confirmed. You will be redirected
                    shortly.
                </p>
            </div>
        )
    }

    return (
        <div>
            <h1>Confirmation Failed</h1>
            <p>
                There was an issue with confirming your application. Please try
                again later.
            </p>
        </div>
    )
}

export default EmailConfirmation
