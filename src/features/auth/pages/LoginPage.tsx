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
import { usePageMeta } from '@/hooks/use-page-meta'

const LoginPageContent = () => {
    usePageMeta({
        title: 'Login | People Hub',
        description:
            'Sign in to People Hub to manage HR, recruitment, payroll, assets, and operations.',
    })

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
                <RingLoader color="#334155" />
            </div>
        )
    }

    return (
        <AuthPageShell
            heroTitle={
                <>
                    People Hub
                </>
            }
            heroDescription="A small HR workspace for the team that runs hiring, leave, payroll, and assets."
            cardTitle="Sign in"
            cardDescription="Use your team account to continue."
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
                                    className="text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
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
                    className="mt-8 h-12 w-full rounded-lg border border-slate-900 bg-slate-950 text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                    disabled={form.state.isSubmitting}
                >
                    {form.state.isSubmitting
                        ? 'Signing in...'
                        : 'Sign in'}
                </Button>

                {error && (
                    <div className="p-3 mt-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-lg shadow-sm">
                        <ErrorText className="text-center w-full block m-0">
                            {error}
                        </ErrorText>
                    </div>
                )}

                <div className="border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                    Looking for an open role?{' '}
                    <Link
                        to="/career"
                        className="font-semibold text-slate-900 transition-colors hover:text-slate-700"
                    >
                        View careers
                    </Link>
                </div>
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
