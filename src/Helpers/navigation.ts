import type { Location } from 'react-router-dom'

type LocationLike = Pick<Location, 'pathname' | 'search' | 'hash'>

type NavigationState = {
    returnTo?: unknown
}

const isSafeInternalPath = (value: unknown): value is string =>
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\n') &&
    !value.includes('\r')

export const getCurrentRoute = (location: LocationLike) =>
    `${location.pathname}${location.search}${location.hash}`

export const getReturnState = (location: LocationLike): NavigationState => ({
    returnTo: getCurrentRoute(location),
})

export const getReturnTo = (state: unknown, fallback: string) => {
    const returnTo =
        state && typeof state === 'object'
            ? (state as NavigationState).returnTo
            : undefined

    return isSafeInternalPath(returnTo) ? returnTo : fallback
}
