import dayjs from 'dayjs'
import { Vacation } from './types'

export const formatVacationType = (type: Vacation['type']) => {
    switch (type) {
        case 'sick':
            return 'Sick Leave'
        case 'personal':
            return 'Personal Leave'
        case 'maternity':
            return 'Maternity Leave'
        default:
            return 'Vacation Leave'
    }
}

export const getVacationDurationDays = (
    startDate?: string | null,
    endDate?: string | null,
) => {
    if (!startDate || !endDate) {
        return 0
    }

    const start = dayjs(startDate)
    const end = dayjs(endDate)

    if (!start.isValid() || !end.isValid()) {
        return 0
    }

    return Math.max(end.diff(start, 'day') + 1, 0)
}

export const getVacationStatusColor = (status: Vacation['status']) => {
    switch (status) {
        case 'accepted':
            return 'green'
        case 'rejected':
            return 'red'
        default:
            return 'orange'
    }
}

export const sortVacationsNewestFirst = (vacations: Vacation[]) =>
    [...vacations].sort(
        (left, right) =>
            dayjs(right.startDate).valueOf() - dayjs(left.startDate).valueOf(),
    )

export const getAcceptedVacationDaysForYear = (
    vacations: Vacation[],
    year = dayjs().year(),
) =>
    vacations.reduce((total, vacation) => {
        if (
            vacation.status !== 'accepted' ||
            dayjs(vacation.startDate).year() !== year
        ) {
            return total
        }

        return (
            total +
            getVacationDurationDays(vacation.startDate, vacation.endDate)
        )
    }, 0)
