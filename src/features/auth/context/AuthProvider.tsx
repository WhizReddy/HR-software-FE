import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { PublicAxiosInstance } from '@/Helpers/Axios'
import type { AuthContextType, BackendStatus, User } from './auth.types'

export const AuthContext = React.createContext<AuthContextType | undefined>(
    undefined,
)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isInitializing, setIsInitializing] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [backendStatus, setBackendStatus] =
        useState<BackendStatus>('checking')
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const healthSlowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    )
    const backendCheckPromiseRef = useRef<Promise<void> | null>(null)

    const clearSession = useCallback(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_role')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        setUserRole(null)
        setCurrentUser(null)
    }, [])

    const getTokenExpirationMs = useCallback((token: string): number | null => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (!payload?.exp || typeof payload.exp !== 'number') {
                return null
            }
            return payload.exp * 1000
        } catch {
            return null
        }
    }, [])

    const scheduleAutoLogout = useCallback(
        (token: string) => {
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current)
                logoutTimerRef.current = null
            }

            const expMs = getTokenExpirationMs(token)
            if (!expMs) return

            const timeoutMs = expMs - Date.now()
            if (timeoutMs <= 0) {
                clearSession()
                return
            }

            logoutTimerRef.current = setTimeout(() => {
                clearSession()
            }, timeoutMs)
        },
        [clearSession, getTokenExpirationMs],
    )

    const refreshBackendStatus = useCallback(async () => {
        if (backendCheckPromiseRef.current) {
            return backendCheckPromiseRef.current
        }

        if (healthSlowTimerRef.current) {
            clearTimeout(healthSlowTimerRef.current)
        }

        setBackendStatus((currentStatus) =>
            currentStatus === 'ready' ? 'ready' : 'checking',
        )

        healthSlowTimerRef.current = setTimeout(() => {
            setBackendStatus((currentStatus) =>
                currentStatus === 'checking' ? 'slow' : currentStatus,
            )
        }, 3000)

        backendCheckPromiseRef.current = PublicAxiosInstance.get('/health')
            .then(() => {
                setBackendStatus('ready')
            })
            .catch(() => {
                setBackendStatus('offline')
            })
            .finally(() => {
                if (healthSlowTimerRef.current) {
                    clearTimeout(healthSlowTimerRef.current)
                    healthSlowTimerRef.current = null
                }
                backendCheckPromiseRef.current = null
            })

        return backendCheckPromiseRef.current
    }, [])

    useEffect(() => {
        const access_token = localStorage.getItem('access_token')
        const storedUserRole = localStorage.getItem('user_role')
        const storedUserData = localStorage.getItem('user')

        if (access_token && storedUserRole && storedUserData) {
            const expMs = getTokenExpirationMs(access_token)
            if (expMs && expMs <= Date.now()) {
                clearSession()
            } else {
                try {
                    const user: User = JSON.parse(storedUserData)
                    setIsAuthenticated(true)
                    setUserRole(storedUserRole)
                    setCurrentUser(user)
                    scheduleAutoLogout(access_token)
                } catch {
                    clearSession()
                }
            }
        }

        setIsInitializing(false)

        const handleLogoutEvent = () => clearSession()
        window.addEventListener('auth:logout', handleLogoutEvent)

        void refreshBackendStatus()

        const pingInterval = setInterval(() => {
            if (localStorage.getItem('access_token')) {
                void refreshBackendStatus()
            }
        }, 10 * 60 * 1000)

        return () => {
            window.removeEventListener('auth:logout', handleLogoutEvent)
            clearInterval(pingInterval)
            if (healthSlowTimerRef.current) {
                clearTimeout(healthSlowTimerRef.current)
            }
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current)
            }
        }
    }, [
        clearSession,
        getTokenExpirationMs,
        refreshBackendStatus,
        scheduleAutoLogout,
    ])

    const login = (access_token: string, role: string, user: User) => {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user_role', role)
        localStorage.setItem('user', JSON.stringify(user))
        setIsAuthenticated(true)
        setUserRole(role)
        setCurrentUser(user)
        scheduleAutoLogout(access_token)
    }

    const logout = () => {
        clearSession()
    }

    return (
        <AuthContext.Provider
            value={{
                isInitializing,
                isAuthenticated,
                userRole,
                currentUser,
                backendStatus,
                login,
                logout,
                refreshBackendStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
