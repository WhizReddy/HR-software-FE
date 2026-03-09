import { User } from '@/Context/Interface'

export interface AuthPayload {
    access_token: string
    user: User
}

export interface AuthResponse {
    message: string
    data: AuthPayload
}

export interface ApiErrorResponse {
    message?: string | string[]
}
