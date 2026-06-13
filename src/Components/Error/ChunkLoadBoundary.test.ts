import { describe, expect, it } from 'vitest'
import { isChunkLoadError } from './ChunkLoadBoundary'

describe('isChunkLoadError', () => {
    it('detects failed dynamic imports from stale deployed chunks', () => {
        expect(
            isChunkLoadError(
                new TypeError(
                    'Failed to fetch dynamically imported module: https://example.com/assets/ViewCandidats-old.js',
                ),
            ),
        ).toBe(true)
    })

    it('ignores unrelated errors', () => {
        expect(
            isChunkLoadError(new Error('Request failed with status 500')),
        ).toBe(false)
    })
})
