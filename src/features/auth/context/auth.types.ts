export interface User {
    email: string
    _id: string | number
    name: string
    firstName: string
    lastName: string
    phone: string
    role: string
    imageUrl: string
}

export type BackendStatus = 'checking' | 'slow' | 'ready' | 'offline'

export interface AuthContextType {
    isInitializing: boolean
    isAuthenticated: boolean
    userRole: string | null
    currentUser: User | null
    backendStatus: BackendStatus
    login: (access_token: string, role: string, user: User) => void
    logout: () => void
    refreshBackendStatus: () => Promise<void>
}
