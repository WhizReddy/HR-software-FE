import Input from '../../../../Components/Input/Index'
import Button from '../../../../Components/Button/Button'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import { usePassword } from './Context/Hook'
import { PasswordProvider } from './Context/PasswordProvider'

function ChangePassContent() {
    const {
        currentPassword,
        newPassword,
        confirmPassword,
        error,
        success,
        handleChange,
        handleUpdatePassword,
    } = usePassword()

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70">
                <div className="mb-8 border-b border-slate-100/50 pb-4">
                    <h3 className="text-xl font-bold text-[#2457a3]">Security Settings</h3>
                    <p className="text-slate-500 mt-2 text-sm">
                        Update your password to keep your account secure. We recommend using a strong password that you don't use elsewhere.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left side info */}
                    <div className="space-y-6 flex flex-col justify-center bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                        <div className="bg-[#2457a3]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                            <span className="text-[#2457a3] text-xl">🛡️</span>
                        </div>
                        <h4 className="font-semibold text-slate-800 text-lg">Password Requirements</h4>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Minimum 8 characters long
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                At least one uppercase & lowercase letter
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                At least one number (0-9)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                At least one special character (!@#$%)
                            </li>
                        </ul>
                    </div>

                    {/* Right side form */}
                    <div className="space-y-5">
                        {success && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500 rounded-full p-1">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-700">{success}</p>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-500 rounded-full p-1">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <Button
                                type={ButtonTypes.PRIMARY}
                                btnText="Update Password"
                                onClick={handleUpdatePassword}
                                className="w-full sm:w-auto flex-1 bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md active:scale-95 py-2.5 rounded-lg font-medium"
                            />
                            <Button
                                type={ButtonTypes.SECONDARY}
                                btnText="Forgot Password?"
                                onClick={() => window.location.href = '/forgot-password'}
                                className="w-full sm:w-auto flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all shadow-sm active:scale-95 py-2.5 rounded-lg font-medium"
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
