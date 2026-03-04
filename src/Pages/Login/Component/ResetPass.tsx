import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AxiosInstance from '@/Helpers/Axios'

import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'



const ResetPass: React.FC = () => {
    const [searchParams] = useSearchParams()
    const tokenFromUrl = searchParams.get('token')

    // Determine step: if there's a token in the URL, go straight to reset
    const step = tokenFromUrl ? 'reset' : 'email'
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!email.trim()) {
            setError('Please enter your email address')
            return
        }

        setIsLoading(true)
        try {
            await AxiosInstance.post('/auth/forgot-password', { email })
            setSuccess('Password reset link has been sent to your email. Check your inbox.')
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send reset link. Please try again.'
            setError(Array.isArray(msg) ? msg[0] : msg)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
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
            await AxiosInstance.post('/auth/reset-password', {
                token,
                newPassword,
            })
            setSuccess('Password reset successfully! You can now log in with your new password.')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.'
            setError(Array.isArray(msg) ? msg[0] : msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1 items-center justify-center pb-8 pt-8">
                    <div className="bg-primary-blue text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-md rotate-3 transition-transform hover:rotate-0">
                        <h2 className="text-3xl font-extrabold tracking-wider">CRM</h2>
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {step === 'email'
                            ? 'Enter your email to receive a reset link'
                            : 'Enter your new password'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'email' ? (
                        <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 focus-visible:ring-primary-blue"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary-blue hover:bg-primary-blue-dark text-white font-medium text-base rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleResetPasswordSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-slate-700 font-medium">
                                    New Password
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 focus-visible:ring-primary-blue"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-11 focus-visible:ring-primary-blue"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary-blue hover:bg-primary-blue-dark text-white font-medium text-base rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}

                    {error && (
                        <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-3 mt-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-600 text-center">{success}</p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-sm text-primary-blue hover:underline font-medium"
                        >
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ResetPass
