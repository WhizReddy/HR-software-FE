import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const AxiosInstance = axios.create({
    baseURL: API_URL,
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
        if (error?.response?.status === 401) {
            window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(error)
    },
)

export default AxiosInstance
