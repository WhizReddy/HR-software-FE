import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { AuthContextType, User } from './Interface'
import AxiosInstance from '@/Helpers/Axios'

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
    const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    const scheduleAutoLogout = useCallback((token: string) => {
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
    }, [clearSession, getTokenExpirationMs])

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

        // Keep-alive ping to prevent Render free tier from sleeping
        const pingInterval = setInterval(() => {
            if (localStorage.getItem('access_token')) {
                AxiosInstance.get('/health').catch(() => { /* mute errors */ });
            }
        }, 10 * 60 * 1000); // 10 minutes

        return () => {
            window.removeEventListener('auth:logout', handleLogoutEvent)
            clearInterval(pingInterval)
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current)
            }
        }
    }, [clearSession, getTokenExpirationMs, scheduleAutoLogout])

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
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
