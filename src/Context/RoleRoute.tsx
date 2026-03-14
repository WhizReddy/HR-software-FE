import type { ReactElement } from 'react'
import { useAuth } from './AuthProvider'
import { Navigate, useParams } from 'react-router-dom'

interface RoleRouteProps {
  children: ReactElement
  allowedRoles?: string[]
  allowSelfParam?: string
  fallbackPath?: string
}

export default function RoleRoute({
  children,
  allowedRoles = [],
  allowSelfParam,
  fallbackPath = '/dashboard',
}: RoleRouteProps) {
  const { currentUser, isAuthenticated, isInitializing, userRole } = useAuth()
  const params = useParams()

  if (isInitializing) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const hasRoleAccess =
    allowedRoles.length === 0 || allowedRoles.includes(userRole ?? '')
  const hasSelfAccess = Boolean(
    allowSelfParam &&
      currentUser?._id &&
      params[allowSelfParam] &&
      String(currentUser._id) === String(params[allowSelfParam]),
  )

  if (!hasRoleAccess && !hasSelfAccess) {
    return <Navigate to={fallbackPath} replace />
  }

  return children
}
