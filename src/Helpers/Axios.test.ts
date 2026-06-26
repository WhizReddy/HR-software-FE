import type { AxiosAdapter } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AxiosInstance, { API_URL, resolveApiAssetUrl } from './Axios'

const originalAdapter = AxiosInstance.defaults.adapter

describe('Axios auth handling', () => {
    afterEach(() => {
        AxiosInstance.defaults.adapter = originalAdapter
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('dispatches auth logout when an authenticated private request returns 401', async () => {
        const logoutListener = vi.fn()
        window.addEventListener('auth:logout', logoutListener)
        localStorage.setItem('access_token', 'active-token')
        AxiosInstance.defaults.adapter = (() =>
            Promise.reject({
                config: { url: '/user' },
                response: { status: 401 },
            })) as AxiosAdapter

        await expect(AxiosInstance.get('/user')).rejects.toBeTruthy()

        expect(logoutListener).toHaveBeenCalledTimes(1)
        window.removeEventListener('auth:logout', logoutListener)
    })

    it('does not dispatch auth logout for public auth 401 responses', async () => {
        const logoutListener = vi.fn()
        window.addEventListener('auth:logout', logoutListener)
        localStorage.setItem('access_token', 'active-token')
        AxiosInstance.defaults.adapter = (() =>
            Promise.reject({
                config: { url: '/auth/signin' },
                response: { status: 401 },
            })) as AxiosAdapter

        await expect(AxiosInstance.post('/auth/signin')).rejects.toBeTruthy()

        expect(logoutListener).not.toHaveBeenCalled()
        window.removeEventListener('auth:logout', logoutListener)
    })

    it('does not use the deployed backend as a missing-env fallback in tests', () => {
        expect(API_URL).toBe('http://localhost:3000')
        expect(API_URL).not.toContain('onrender.com')
        expect(resolveApiAssetUrl('/uploads/cv.pdf')).toBe(
            'http://localhost:3000/uploads/cv.pdf',
        )
    })
})
