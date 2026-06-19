import { describe, expect, it } from 'vitest'
import { safeParse } from 'valibot'
import {
    RECRUITMENT_CV_MAX_SIZE_BYTES,
    RECRUITMENT_CV_MAX_SIZE_MB,
    RecruitmentSchema,
} from './Recruitment.schema'

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

    it('accepts international phone numbers with common separators', () => {
        expect(
            safeParse(
                RecruitmentSchema.entries.phoneNumber,
                '+355 69 123 4567',
            ).success,
        ).toBe(true)
        expect(
            safeParse(RecruitmentSchema.entries.phoneNumber, '+44 7911 123456')
                .success,
        ).toBe(true)
    })

    it('keeps the CV upload limit aligned with the backend', () => {
        expect(RECRUITMENT_CV_MAX_SIZE_MB).toBe(5)
        expect(RECRUITMENT_CV_MAX_SIZE_BYTES).toBe(5 * 1024 * 1024)
    })
})
