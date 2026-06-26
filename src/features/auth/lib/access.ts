export const ADMIN_ROLES = ['admin', 'hr'] as const

export const isAdminRole = (role?: string | null) =>
    ADMIN_ROLES.includes((role ?? '') as (typeof ADMIN_ROLES)[number])

export const getDefaultPrivatePath = (role?: string | null) =>
    isAdminRole(role) ? '/dashboard' : '/holdings'

export const isSelfUser = (
    currentUserId?: string | number | null,
    targetUserId?: string | null,
) =>
    Boolean(
        currentUserId &&
            targetUserId &&
            String(currentUserId) === String(targetUserId),
    )
