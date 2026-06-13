import { describe, expect, it } from 'vitest'
import {
    ensurePaginationParams,
    parseNumberParam,
    upsertFilterParams,
} from './urlFilters'

describe('urlFilters', () => {
    it('falls back for invalid numeric params when bounds are provided', () => {
        const params = new URLSearchParams('page=-1&limit=999')

        expect(parseNumberParam(params, 'page', 0, { min: 0 })).toBe(0)
        expect(
            parseNumberParam(params, 'limit', 5, {
                min: 1,
                allowedValues: [5, 10, 20],
            }),
        ).toBe(5)
    })

    it('ensures pagination while preserving unrelated filters', () => {
        const params = ensurePaginationParams(
            new URLSearchParams('page=-1&limit=999&role=admin'),
            {
                allowedLimits: [5, 10, 20],
            },
        )

        expect(params.get('page')).toBe('0')
        expect(params.get('limit')).toBe('5')
        expect(params.get('role')).toBe('admin')
    })

    it('deletes empty filters and resets the page when requested', () => {
        const params = upsertFilterParams(
            new URLSearchParams('page=3&limit=10&search=redi'),
            { search: '' },
            { resetPage: true },
        )

        expect(params.get('search')).toBeNull()
        expect(params.get('page')).toBe('0')
        expect(params.get('limit')).toBe('10')
    })
})
