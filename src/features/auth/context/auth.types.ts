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

export interface AuthContextType {
    isInitializing: boolean
    isAuthenticated: boolean
    userRole: string | null
    currentUser: User | null
    login: (access_token: string, role: string, user: User) => void
    logout: () => void
}
