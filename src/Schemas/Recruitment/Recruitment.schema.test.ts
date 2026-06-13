import { describe, expect, it } from 'vitest'
import { safeParse } from 'valibot'
import { RecruitmentSchema } from './Recruitment.schema'

describe('RecruitmentSchema', () => {
    it('rejects invalid email and phone values', () => {
        expect(
            safeParse(RecruitmentSchema.entries.email, 'not-an-email').success,
        ).toBe(false)
        expect(
            safeParse(RecruitmentSchema.entries.phoneNumber, '12345').success,
        ).toBe(false)
    })

    it('accepts the expected Albania mobile number format', () => {
        expect(
            safeParse(RecruitmentSchema.entries.phoneNumber, '691234567')
                .success,
        ).toBe(true)
    })
})
