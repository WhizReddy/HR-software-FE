export const normalizePhoneNumber = (value: string) =>
    value.trim().replace(/[\s().-]/g, '')

export const isValidRecruitmentPhoneNumber = (value: string) => {
    const normalizedValue = normalizePhoneNumber(value)

    return /^\+?[1-9]\d{7,14}$/.test(normalizedValue)
}
