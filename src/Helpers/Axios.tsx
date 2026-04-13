import axios from 'axios'
import { REQUEST_TIMEOUT_MS } from '@/lib/api-error'

export const API_URL =
    (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
    'https://hr-software-backend.onrender.com'

export const PublicAxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: REQUEST_TIMEOUT_MS,
})

export const resolveApiAssetUrl = (path?: string | null) => {
    if (!path) return ''
    return path.startsWith('http') ? path : `${API_URL}${path}`
}

const AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: REQUEST_TIMEOUT_MS,
})

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl =
            typeof error?.config?.url === 'string' ? error.config.url : ''
        const isPublicAuthRequest =
            requestUrl.startsWith('/auth/signin') ||
            requestUrl.startsWith('/auth/forgot-password') ||
            requestUrl.startsWith('/auth/reset-password')

        if (
            error?.response?.status === 401 &&
            !isPublicAuthRequest &&
            localStorage.getItem('access_token')
        ) {
            window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(error)
    },
)

export default AxiosInstance
