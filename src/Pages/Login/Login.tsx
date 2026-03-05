import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"

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
        <div className="min-h-screen w-full flex relative overflow-hidden bg-slate-50">
            {/* Ambient Background Blur */}
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-sky-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative w-full flex items-center justify-center p-4 z-10">
                <Card className="w-full max-w-[440px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 bg-white/70 backdrop-blur-2xl rounded-3xl">
                    <CardHeader className="space-y-2 items-center justify-center pb-8 pt-10">
                        <div className="bg-gradient-to-br from-[#2457a3] to-[#4A7BCD] text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ring-white/50 transition-transform hover:scale-105 duration-300">
                            <h2 className="text-3xl font-extrabold tracking-wider">CRM</h2>
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight text-slate-800">Welcome Back</CardTitle>
                        <CardDescription className="text-slate-500 font-medium text-base">
                            Sign in to your HR Management System
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-10">
                        <form
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                form.handleSubmit()
                            }}
                        >
                            <form.Field
                                name="email"
                                validators={{
                                    onChange: LoginSchema.entries.email,
                                }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value)
                                            }
                                            className="h-11 focus-visible:ring-primary-blue"
                                        />
                                        {field.state.meta.errors && (
                                            <ErrorText>
                                                {field.state.meta.errors.join(', ')}
                                            </ErrorText>
                                        )}
                                    </div>
                                )}
                            />

                            <form.Field
                                name="password"
                                validators={{
                                    onChange: LoginSchema.entries.password,
                                }}
                                children={(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.value)
                                                }
                                                className="h-11 focus-visible:ring-primary-blue pr-10"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {field.state.meta.errors && (
                                            <ErrorText>
                                                {field.state.meta.errors}
                                            </ErrorText>
                                        )}
                                    </div>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-[#2457a3] to-[#4A7BCD] hover:opacity-90 text-white font-medium text-base rounded-xl transition-all shadow-md mt-6"
                                disabled={form.state.isSubmitting}
                            >
                                {form.state.isSubmitting ? 'Logging in...' : 'Sign In'}
                            </Button>

                            {error && (
                                <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded-md">
                                    <ErrorText className="text-center w-full block m-0">{error}</ErrorText>
                                </div>
                            )}

                            <div className="text-center mt-4">
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-[#2457a3] hover:text-[#1a407a] hover:underline transition-colors font-medium"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
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