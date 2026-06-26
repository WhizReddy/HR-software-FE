import { describe, expect, it } from 'vitest'
import { getCurrentRoute, getReturnState, getReturnTo } from './navigation'

describe('navigation helpers', () => {
    it('preserves the current internal route as return state', () => {
        const location = {
            pathname: '/candidates',
            search: '?status=active&page=2&limit=10',
            hash: '#row-3',
        }

        expect(getCurrentRoute(location)).toBe(
            '/candidates?status=active&page=2&limit=10#row-3',
        )
        expect(getReturnState(location)).toEqual({
            returnTo: '/candidates?status=active&page=2&limit=10#row-3',
        })
    })

    it('falls back when return state is missing or unsafe', () => {
        expect(getReturnTo(undefined, '/dashboard')).toBe('/dashboard')
        expect(getReturnTo({ returnTo: 'https://example.com' }, '/dashboard')).toBe(
            '/dashboard',
        )
        expect(getReturnTo({ returnTo: '//example.com' }, '/dashboard')).toBe(
            '/dashboard',
        )
        expect(getReturnTo({ returnTo: '/employees?page=0' }, '/dashboard')).toBe(
            '/employees?page=0',
        )
    })
})
