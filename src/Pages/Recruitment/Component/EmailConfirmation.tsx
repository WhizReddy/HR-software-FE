import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PublicAxiosInstance } from '@/Helpers/Axios'
import { getApiErrorMessage } from '@/lib/api-error'
import { buttonVariants } from '@/Components/ui/button'
import AuthPageShell from '@/features/auth/components/AuthPageShell'

type ConfirmationStatus = 'confirming' | 'success' | 'error'

const statusCopy: Record<
    ConfirmationStatus,
    {
        description: string
        icon: React.ComponentType<{ className?: string }>
        iconClassName: string
        title: string
    }
> = {
    confirming: {
        title: 'Confirming your application',
        description:
            'Please wait while we validate your application confirmation link.',
        icon: LoaderCircle,
        iconClassName: 'animate-spin text-[#2457a3]',
    },
    success: {
        title: 'Application confirmed',
        description:
            'Your application is now active. You will be redirected to the career page shortly.',
        icon: CheckCircle2,
        iconClassName: 'text-emerald-500',
    },
    error: {
        title: 'Confirmation failed',
        description:
            'This confirmation link is invalid, expired, or the server could not complete the request.',
        icon: CircleAlert,
        iconClassName: 'text-red-500',
    },
}

export default function EmailConfirmation() {
    const { search } = useLocation()
    const navigate = useNavigate()
    const token = new URLSearchParams(search).get('token')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [status, setStatus] = useState<ConfirmationStatus>('confirming')

    useEffect(() => {
        let isMounted = true
        let redirectTimer: number | undefined

        const confirm = async () => {
            if (!token) {
                if (isMounted) {
                    setStatus('error')
                    setErrorMessage(
                        'The confirmation link is missing a valid token.',
                    )
                }
                return
            }

            try {
                await PublicAxiosInstance.get(`/applicant/confirm?token=${token}`)
                if (!isMounted) {
                    return
                }

                setStatus('success')
                redirectTimer = window.setTimeout(() => {
                    navigate('/career', { replace: true })
                }, 2000)
            } catch (error: unknown) {
                if (!isMounted) {
                    return
                }

                setStatus('error')
                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        'There was an issue confirming your application. Please try again later.',
                    ),
                )
            }
        }

        void confirm()

        return () => {
            isMounted = false
            if (redirectTimer) {
                window.clearTimeout(redirectTimer)
            }
        }
    }, [navigate, token])

    const { description, icon: StatusIcon, iconClassName, title } =
        statusCopy[status]

    return (
        <AuthPageShell
            heroTitle={
                <>
                    Hiring without <br />
                    <span className="text-blue-200">guesswork.</span>
                </>
            }
            heroDescription="Track applications, keep communication clear, and move candidates through a cleaner recruiting flow."
            cardTitle={title}
            cardDescription={description}
        >
            <div className="space-y-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <StatusIcon className={`h-8 w-8 ${iconClassName}`} />
                </div>

                {errorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50/80 p-3 text-sm font-medium text-red-600">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {status !== 'confirming' && (
                        <Link
                            to="/career"
                            className={buttonVariants({
                                className:
                                    'h-12 w-full bg-[#2457a3] text-white hover:bg-[#1a407a]',
                            })}
                        >
                            Return to Career Page
                        </Link>
                    )}

                    <Link
                        to="/"
                        className="text-sm font-medium text-[#2457a3] transition-colors hover:text-[#1a407a] hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </AuthPageShell>
    )
}
