import { useContext, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { RingLoader } from 'react-spinners'
import { Link, useNavigate } from 'react-router-dom'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { LoginContext, LoginProvider } from '../context/LoginContext'
import { useAuth } from '../context/AuthProvider'
import { useLoginForm } from '../hooks/useLoginForm'
import { LoginSchema } from '../schemas/login.schema'
import AuthPageShell from '../components/AuthPageShell'

const LoginPageContent = () => {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const {
        checkingIsAuthenticated,
        setCheckingIsAuthenticated,
        error,
        setError,
        setShowPassword,
        showPassword,
    } = useContext(LoginContext)

    const { form } = useLoginForm(setError)
    const renderFieldErrors = (errors: unknown[] | null | undefined) =>
        Array.isArray(errors) && errors.length > 0 ? (
            <ErrorText>{errors.join(', ')}</ErrorText>
        ) : null

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true })
        }
        setCheckingIsAuthenticated(false)
    }, [isAuthenticated, navigate, setCheckingIsAuthenticated])

    if (checkingIsAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <RingLoader color="#2457A3" />
            </div>
        )
    }

    return (
        <AuthPageShell
            heroTitle={
                <>
                    Manage your people <br />
                    <span className="text-blue-200">brilliantly.</span>
                </>
            }
            heroDescription="The all-in-one modern toolkit designed for HR teams to drive engagement, manage assets, and streamline recruitment effortlessly."
            cardTitle="Welcome Back"
            cardDescription="Please sign in to your account"
        >
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void form.handleSubmit()
                }}
            >
                <form.Field
                    name="email"
                    validators={{ onChange: LoginSchema.entries.email }}
                    children={(field) => (
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-xs font-semibold uppercase text-slate-600"
                            >
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={field.state.value}
                                onChange={(e) =>
                                    field.handleChange(e.target.value)
                                }
                                className="h-12 bg-white"
                            />
                            {renderFieldErrors(field.state.meta.errors)}
                        </div>
                    )}
                />

                <form.Field
                    name="password"
                    validators={{ onChange: LoginSchema.entries.password }}
                    children={(field) => (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-semibold uppercase text-slate-600"
                                >
                                    Password
                                </Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-[#2457a3] hover:text-[#1a407a] transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    className="h-12 bg-white pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {renderFieldErrors(field.state.meta.errors)}
                        </div>
                    )}
                />

                <Button
                    type="submit"
                    className="mt-8 h-12 w-full rounded-md bg-[#2457a3] text-base font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-colors hover:bg-[#1a407a]"
                    disabled={form.state.isSubmitting}
                >
                    {form.state.isSubmitting
                        ? 'Authenticating...'
                        : 'Sign In'}
                </Button>

                {error && (
                    <div className="p-3 mt-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-lg shadow-sm">
                        <ErrorText className="text-center w-full block m-0">
                            {error}
                        </ErrorText>
                    </div>
                )}
            </form>
        </AuthPageShell>
    )
}

export default function LoginPage() {
    return (
        <LoginProvider>
            <LoginPageContent />
        </LoginProvider>
    )
}
