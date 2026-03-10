import { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/Context/AuthProvider'
import { LoginContext, LoginProvider } from './LoginContext'
import { useFormLogin } from './Hook'
import { LoginSchema } from '@/Schemas/Login/Login.schema'
import { RingLoader } from 'react-spinners'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

const LoginComponent = () => {
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

    const { form } = useFormLogin(setError)

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            setCheckingIsAuthenticated(false)
            navigate('/dashboard')
        } else {
            setCheckingIsAuthenticated(false)
        }
    }, [isAuthenticated, navigate, setCheckingIsAuthenticated])

    if (checkingIsAuthenticated)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <RingLoader color="#2457A3" />
            </div>
        )

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
                            Manage your people <br />
                            <span className="text-blue-200">brilliantly.</span>
                        </h1>
                        <p className="text-blue-100/80 text-lg max-w-md font-light">
                            The all-in-one modern toolkit designed for HR teams to drive engagement, manage assets, and streamline recruitment effortlessly.
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

                {/* Right Login Panel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                    <div className="w-full max-w-md space-y-8 glass-modal p-8 sm:p-10 border border-white/60">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back</h2>
                            <p className="text-slate-500 font-medium">Please sign in to your account</p>
                        </div>

                        <form
                            className="space-y-6 mt-8"
                            onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                        >
                            <form.Field
                                name="email"
                                validators={{ onChange: LoginSchema.entries.email }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="h-12 bg-white/70"
                                        />
                                        {field.state.meta.errors && (
                                            <ErrorText>{field.state.meta.errors.join(', ')}</ErrorText>
                                        )}
                                    </div>
                                )}
                            />

                            <form.Field
                                name="password"
                                validators={{ onChange: LoginSchema.entries.password }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Password</Label>
                                            <Link to="/forgot-password" className="text-sm font-semibold text-[#2457a3] hover:text-[#1a407a] transition-colors">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className="h-12 pr-10 bg-white/70"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {field.state.meta.errors && (
                                            <ErrorText>{field.state.meta.errors}</ErrorText>
                                        )}
                                    </div>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#2457a3] hover:bg-[#1a407a] text-white font-semibold text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 mt-8"
                                disabled={form.state.isSubmitting}
                            >
                                {form.state.isSubmitting ? 'Authenticating...' : 'Sign In'}
                            </Button>

                            {error && (
                                <div className="p-3 mt-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-lg shadow-sm">
                                    <ErrorText className="text-center w-full block m-0">{error}</ErrorText>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Login() {
    return (
        <LoginProvider>
            <LoginComponent />
        </LoginProvider>
    )
}
