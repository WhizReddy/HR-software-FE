export const normalizePhoneNumber = (value: string) => {
    const strippedValue = value.trim().replace(/[^\d+]/g, '')
    const compactValue = strippedValue.startsWith('+')
        ? `+${strippedValue.slice(1).replace(/\+/g, '')}`
        : strippedValue.replace(/\+/g, '')

    if (/^00[1-9]\d{7,14}$/.test(compactValue)) {
        return `+${compactValue.slice(2)}`
    }

    if (/^0\d{6,14}$/.test(compactValue)) {
        return compactValue.slice(1)
    }

    if (/^355\d{6,12}$/.test(compactValue)) {
        return `+${compactValue}`
    }

    return compactValue
}

export const isValidRecruitmentPhoneNumber = (value: string) => {
    const normalizedValue = normalizePhoneNumber(value)

    return (
        /^[1-9]\d{6,14}$/.test(normalizedValue) ||
        /^\+[1-9]\d{6,14}$/.test(normalizedValue)
    )
}
