import Input from '../../../../Components/Input/Index'
import Button from '../../../../Components/Button/Button'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import { usePassword } from './Context/Hook'
import { PasswordProvider } from './Context/PasswordProvider'
import { ShieldCheck } from 'lucide-react'

function ChangePassContent() {
    const {
        currentPassword,
        newPassword,
        confirmPassword,
        error,
        success,
        isUpdatingPassword,
        handleChange,
        handleUpdatePassword,
    } = usePassword()

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-8">
                <div className="mb-8 border-b border-slate-100 pb-4">
                    <h3 className="text-xl font-semibold text-slate-600">Security Settings</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Update your password to keep your account secure. We recommend using a strong password that you don't use elsewhere.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left side info */}
                    <div className="flex flex-col justify-center space-y-6 rounded-lg border border-slate-200 bg-slate-50 p-6">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <ShieldCheck size={22} />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-950">Password Requirements</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                Minimum 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                At least one uppercase & lowercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                At least one number (0-9)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                At least one special character (!@#$%)
                            </li>
                        </ul>
                    </div>

                    {/* Right side form */}
                    <div className="space-y-5">
                        {success && (
                            <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-emerald-500 p-1">
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-700">{success}</p>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-red-200 bg-red-50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-red-500 p-1">
                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Input
                                label="Current Password"
                                name="currentPassword"
                                isPassword
                                type="password"
                                onChange={handleChange}
                                value={currentPassword}
                                width="100%"
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="New Password"
                                name="newPassword"
                                isPassword
                                type="password"
                                onChange={handleChange}
                                value={newPassword}
                                width="100%"
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                isPassword
                                type="password"
                                onChange={handleChange}
                                value={confirmPassword}
                                width="100%"
                            />
                        </div>

                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <Button
                                type={ButtonTypes.PRIMARY}
                                btnText={
                                    isUpdatingPassword
                                        ? 'Updating...'
                                        : 'Update Password'
                                }
                                onClick={handleUpdatePassword}
                                disabled={isUpdatingPassword}
                                className="w-full flex-1 sm:w-auto"
                            />
                            <Button
                                type={ButtonTypes.SECONDARY}
                                btnText="Forgot Password?"
                                onClick={() => window.location.href = '/forgot-password'}
                                className="w-full flex-1 sm:w-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChangePass: React.FC = () => {
    return (
        <PasswordProvider>
            <ChangePassContent />
        </PasswordProvider>
    )
}

export default ChangePass
