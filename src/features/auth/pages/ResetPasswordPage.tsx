import { type FormEvent, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PublicAxiosInstance } from '@/Helpers/Axios'
import { getApiErrorMessage } from '@/lib/api-error'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import AuthPageShell from '../components/AuthPageShell'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const tokenFromUrl = searchParams.get('token')

    const step = tokenFromUrl ? 'reset' : 'email'
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleForgotPasswordSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!email.trim()) {
            setError('Please enter your email address')
            return
        }

        setIsLoading(true)
        try {
            await PublicAxiosInstance.post('/auth/forgot-password', { email })
            setSuccess(
                'Password reset link has been sent to your email. Check your inbox.',
            )
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    'Failed to send reset link. Please try again.',
                ),
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPasswordSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        const token = tokenFromUrl
        if (!token) {
            setError('Invalid reset link. Please request a new password reset.')
            return
        }

        setIsLoading(true)
        try {
            await PublicAxiosInstance.post('/auth/reset-password', {
                token,
                newPassword,
            })
            setSuccess(
                'Password reset successfully! You can now log in with your new password.',
            )
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    'Failed to reset password. The link may have expired.',
                ),
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthPageShell
            heroTitle={
                <>
                    Secure your account <br />
                    <span className="text-blue-200">safely.</span>
                </>
            }
            heroDescription="Reset your password quickly and securely to regain access to your HR Management toolkit."
            cardTitle={step === 'email' ? 'Forgot Password' : 'Reset Password'}
            cardDescription={
                step === 'email'
                    ? 'Enter your email to receive a reset link'
                    : 'Enter your new password'
            }
        >
            {step === 'email' ? (
                <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                    <div className="space-y-2">
                        <Label
                            htmlFor="email"
                            className="text-slate-700 font-bold text-xs uppercase tracking-wider"
                        >
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 bg-white/70"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#2457a3] hover:bg-[#1a407a] text-white font-semibold text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            ) : (
                <form className="space-y-6" onSubmit={handleResetPasswordSubmit}>
                    <div className="space-y-2">
                        <Label
                            htmlFor="newPassword"
                            className="text-slate-700 font-bold text-xs uppercase tracking-wider"
                        >
                            New Password
                        </Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-12 bg-white/70"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-slate-700 font-bold text-xs uppercase tracking-wider"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            className="h-12 bg-white/70"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#2457a3] hover:bg-[#1a407a] text-white font-semibold text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            )}

            {error && (
                <div className="p-3 mt-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-red-600 text-center">
                        {error}
                    </p>
                </div>
            )}

            {success && (
                <div className="p-3 mt-4 bg-green-50/80 backdrop-blur-md border border-green-200 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-green-600 text-center">
                        {success}
                    </p>
                </div>
            )}

            <div className="mt-8 text-center">
                <Link
                    to="/"
                    className="text-sm text-[#2457a3] hover:text-[#1a407a] transition-colors font-medium hover:underline"
                >
                    Back to Login
                </Link>
            </div>
        </AuthPageShell>
    )
}
