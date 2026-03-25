import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PublicAxiosInstance } from '@/Helpers/Axios'

import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
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
            await PublicAxiosInstance.post('/auth/forgot-password', { email })
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
            await PublicAxiosInstance.post('/auth/reset-password', {
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
        <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden">
            {/* Global Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

            {/* Main Split Layout */}
            <div className="flex w-full min-h-screen z-10">

                {/* Left Marketing Panel - Deep Navy Theme */}
                <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#2457a3] p-12 relative overflow-hidden">
                    {/* Inner Accent Decor */}
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl isolate"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl isolate"></div>

                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-12 border border-white/20 shadow-2xl">
                            <h2 className="text-2xl font-extrabold text-white tracking-widest">HR</h2>
                        </div>
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            Secure your account <br />
                            <span className="text-blue-200">safely.</span>
                        </h1>
                        <p className="text-blue-100/80 text-lg max-w-md font-light">
                            Reset your password quickly and securely to regain access to your HR Management toolkit.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-max shadow-xl">
                            <div className="flex -space-x-4">
                                <img className="w-10 h-10 rounded-full border-2 border-[#2457a3]" src="https://i.pravatar.cc/100?img=1" alt="User" />
                                <img className="w-10 h-10 rounded-full border-2 border-[#2457a3]" src="https://i.pravatar.cc/100?img=2" alt="User" />
                                <img className="w-10 h-10 rounded-full border-2 border-[#2457a3]" src="https://i.pravatar.cc/100?img=3" alt="User" />
                            </div>
                            <div className="text-sm text-white font-medium">
                                Trusted by <span className="font-bold text-emerald-400">10,000+</span> professionals
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Reset Panel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                    <div className="w-full max-w-md space-y-8 glass-modal p-8 sm:p-10 border border-white/60">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                                {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {step === 'email'
                                    ? 'Enter your email to receive a reset link'
                                    : 'Enter your new password'}
                            </p>
                        </div>

                        <div className="mt-8">
                            {step === 'email' ? (
                                <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">
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
                                        <Label htmlFor="newPassword" className="text-slate-700 font-bold text-xs uppercase tracking-wider">
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
                                        <Label htmlFor="confirmPassword" className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        </div>

                        {error && (
                            <div className="p-3 mt-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="p-3 mt-4 bg-green-50/80 backdrop-blur-md border border-green-200 rounded-lg shadow-sm">
                                <p className="text-sm font-medium text-green-600 text-center">{success}</p>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPass
