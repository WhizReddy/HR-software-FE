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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-1 items-center justify-center pb-8 pt-8">
                    <div className="bg-primary-blue text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-md rotate-3 transition-transform hover:rotate-0">
                        <h2 className="text-3xl font-extrabold tracking-wider">CRM</h2>
                    </div>
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription className="text-slate-500">
                        HR Management System
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                            className="w-full h-11 bg-primary-blue hover:bg-primary-blue-dark text-white font-medium text-base rounded-md transition-colors"
                            disabled={form.state.isSubmitting}
                        >
                            {form.state.isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>

                        {error && (
                            <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded-md">
                                <ErrorText className="text-center w-full block m-0">{error}</ErrorText>
                            </div>
                        )}

                        <div className="text-center mt-2">
                            <a
                                href="/forgot-password"
                                className="text-sm text-primary-blue hover:underline font-medium"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
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