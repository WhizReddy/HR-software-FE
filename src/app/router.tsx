import { lazy, type ReactNode, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ADMIN_ROLES } from '@/features/auth/lib/access'
import PrivateRoute from '@/features/auth/routing/PrivateRoute'
import RoleRoute from '@/features/auth/routing/RoleRoute'

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const ResetPasswordPage = lazy(
    () => import('@/features/auth/pages/ResetPasswordPage'),
)
const ViewCandidats = lazy(() => import('@/Pages/VIewCandidats/ViewCandidats'))
const Candidates = lazy(() => import('@/Pages/Candidates/Candidates'))
const Dashboard = lazy(() => import('@/Pages/Dashboard/Dashboard'))
const Employees = lazy(() => import('@/Pages/Employees/Employees'))
const Events = lazy(() => import('@/Pages/Events/Events'))
const Interview = lazy(() => import('@/Pages/Interview/Interview'))
const Payroll = lazy(() => import('@/Pages/Payroll/Payroll'))
const Profile = lazy(() => import('@/Pages/Profile/Profile'))
const Recruitment = lazy(() => import('@/Pages/Recruitment/Recruitment'))
const Inventory = lazy(() => import('@/Pages/Inventory/Inventory'))
const Career = lazy(() => import('@/Pages/Career/Career'))
const CareerPosts = lazy(() => import('@/Pages/Career/CareerPosts'))
const Holdings = lazy(() => import('@/Pages/Holdings/Holdings'))
const Vacation = lazy(() => import('@/Pages/Vacation/Vacation'))
const SpecificUserPayroll = lazy(
    () => import('@/Pages/Payroll/SpecificUser/SpecificUserPayroll'),
)
const About = lazy(() => import('@/Pages/About/About'))
const UserVacations = lazy(() => import('@/Pages/Vacation/UserVacations'))
const EmailConfirmation = lazy(
    () => import('@/Pages/Recruitment/Component/EmailConfirmation'),
)
const NotFound = lazy(() => import('@/Pages/NotFound/NotFound'))

const RouteLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">
        Loading...
    </div>
)

const withSuspense = (element: ReactNode) => (
    <Suspense fallback={<RouteLoader />}>{element}</Suspense>
)

const router = createBrowserRouter([
    {
        path: '/',
        element: withSuspense(<LoginPage />),
    },
    {
        path: '/recruitment',
        element: withSuspense(<Recruitment />),
    },
    {
        path: '/applicant/confirm',
        element: withSuspense(<EmailConfirmation />),
    },
    {
        path: '/forgot-password',
        element: withSuspense(<ResetPasswordPage />),
    },
    {
        path: '/reset-password',
        element: withSuspense(<ResetPasswordPage />),
    },
    {
        path: '/career',
        element: withSuspense(<Career />),
    },
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
                path: '/employees',
                element: withSuspense(<Employees />),
            },
            {
                path: '/dashboard',
                element: withSuspense(<Dashboard />),
                index: false,
            },
            {
                path: '/profile/:id',
                element: withSuspense(<Profile />),
            },
            {
                path: '/view/:id',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<ViewCandidats />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/holdings',
                element: withSuspense(<Holdings />),
            },
            {
                path: '/vacation',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<Vacation />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/vacation/:id',
                element: (
                    <RoleRoute
                        allowedRoles={[...ADMIN_ROLES]}
                        allowSelfParam="id"
                    >
                        {withSuspense(<UserVacations />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/payroll/user/:id',
                element: (
                    <RoleRoute
                        allowedRoles={[...ADMIN_ROLES]}
                        allowSelfParam="id"
                    >
                        {withSuspense(<SpecificUserPayroll />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/payroll',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<Payroll />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/candidates',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<Candidates />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/events',
                element: withSuspense(<Events />),
            },
            {
                path: '/interview',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<Interview />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/career-posts',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<CareerPosts />)}
                    </RoleRoute>
                ),
            },
            {
                path: '/historic',
                element: withSuspense(<About />),
            },
            {
                path: '/inventory',
                element: (
                    <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                        {withSuspense(<Inventory />)}
                    </RoleRoute>
                ),
            },
        ],
    },
    {
        path: '*',
        element: withSuspense(<NotFound />),
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}
