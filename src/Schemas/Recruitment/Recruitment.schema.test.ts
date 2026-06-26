import { describe, expect, it } from 'vitest'
import { safeParse } from 'valibot'
import {
    RECRUITMENT_CV_MAX_SIZE_BYTES,
    RECRUITMENT_CV_MAX_SIZE_MB,
    RecruitmentSchema,
} from './Recruitment.schema'
import { normalizePhoneNumber } from '@/Pages/Recruitment/utils/phone'

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
        expect(
            safeParse(RecruitmentSchema.entries.phoneNumber, '069 123 4567')
                .success,
        ).toBe(true)
        expect(
            safeParse(RecruitmentSchema.entries.phoneNumber, '04 234 5678')
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
        expect(
            safeParse(
                RecruitmentSchema.entries.phoneNumber,
                '00355 69 123 4567',
            ).success,
        ).toBe(true)
        expect(
            safeParse(
                RecruitmentSchema.entries.phoneNumber,
                '355 69 123 4567',
            ).success,
        ).toBe(true)
    })

    it('normalizes accepted phone formats before submit', () => {
        expect(normalizePhoneNumber('069 123 4567')).toBe('691234567')
        expect(normalizePhoneNumber('04 234 5678')).toBe('42345678')
        expect(normalizePhoneNumber('+355 69 123 4567')).toBe('+355691234567')
        expect(normalizePhoneNumber('00355 69 123 4567')).toBe('+355691234567')
        expect(normalizePhoneNumber('355 69 123 4567')).toBe('+355691234567')
        expect(normalizePhoneNumber('+44 (0) 7911-123-456')).toBe(
            '+4407911123456',
        )
    })

    it('keeps the CV upload limit aligned with the backend', () => {
        expect(RECRUITMENT_CV_MAX_SIZE_MB).toBe(5)
        expect(RECRUITMENT_CV_MAX_SIZE_BYTES).toBe(5 * 1024 * 1024)
    })
})
