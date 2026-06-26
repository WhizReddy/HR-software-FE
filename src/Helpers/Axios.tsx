import axios from 'axios'
const configuredApiUrl = (
    import.meta.env.VITE_API_URL as string | undefined
)?.replace(/\/+$/, '')

const isTestMode = import.meta.env.MODE === 'test'

export const API_URL = configuredApiUrl || (isTestMode ? 'http://localhost:3000' : '')

export const MISSING_API_URL_MESSAGE =
    'VITE_API_URL is not set. Configure it in your environment before using backend features.'

if (import.meta.env.DEV && !isTestMode && !configuredApiUrl) {
    console.error(MISSING_API_URL_MESSAGE)
}

export const PublicAxiosInstance = axios.create({
    baseURL: API_URL || undefined,
})

export const resolveApiAssetUrl = (path?: string | null) => {
    if (!path) return ''
    if (!API_URL) return path
    return path.startsWith('http') ? path : `${API_URL}${path}`
}

const AxiosInstance = axios.create({
    baseURL: API_URL || undefined,
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
