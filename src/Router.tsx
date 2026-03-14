import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ViewCandidats from './Pages/VIewCandidats/ViewCandidats.tsx'
import PrivateRoute from './Context/ProtectedRoute.tsx'
import RoleRoute from './Context/RoleRoute.tsx'
import Candidates from './Pages/Candidates/Candidates.tsx'
import Dashboard from './Pages/Dashboard/Dashboard.tsx'
import Employees from './Pages/Employees/Employees.tsx'
import Events from './Pages/Events/Events.tsx'
import Interview from './Pages/Interview/Interview.tsx'
import ResetPass from './Pages/Login/Component/ResetPass'
import Login from './Pages/Login/Login'
import Payroll from './Pages/Payroll/Payroll.tsx'
import Profile from './Pages/Profile/Profile'
import Recruitment from './Pages/Recruitment/Recruitment.tsx'
import Inventory from './Pages/Inventory/Inventory.tsx'
import Career from './Pages/Career/Career.tsx'
import CareerPosts from './Pages/Career/CareerPosts.tsx'
import Holdings from './Pages/Holdings/Holdings.tsx'
import Vacation from './Pages/Vacation/Vacation.tsx'
import SpecificUserPayroll from './Pages/Payroll/SpecificUser/SpecificUserPayroll.tsx'
import About from './Pages/About/About.tsx'
import UserVacations from './Pages/Vacation/UserVacations.tsx'
import EmailConfirmation from './Pages/Recruitment/Component/EmailConfirmation.tsx'
import NotFound from './Pages/NotFound/NotFound.tsx'
import { ADMIN_ROLES } from './Helpers/access.ts'

export default function Router() {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Login />,
        },
        {
            path: '/recruitment',
            element: <Recruitment />,
        },
        {
            path: '/applicant/confirm',
            element: <EmailConfirmation />,
        },
        {
            path: '/forgot-password',
            element: <ResetPass />,
        },
        {
            path: '/reset-password',
            element: <ResetPass />,
        },
        {
            path: '/career',
            element: <Career />,
        },
        {
            path: '/',
            element: (
                <>
                    <PrivateRoute />
                </>
            ),
            children: [
                {
                    path: '/employees',
                    element: <Employees />,
                },
                { path: '/dashboard', element: <Dashboard />, index: false },
                {
                    path: '/profile/:id',
                    element: <Profile />,
                },
                {
                    path: '/view/:id',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <ViewCandidats />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/holdings',
                    element: <Holdings />,
                },
                {
                    path: '/vacation',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <Vacation />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/vacation/:id',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]} allowSelfParam="id">
                            <UserVacations />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/payroll/user/:id',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]} allowSelfParam="id">
                            <SpecificUserPayroll />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/payroll',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <Payroll />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/candidates',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <Candidates />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/events',
                    element: <Events />,
                },
                {
                    path: '/interview',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <Interview />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/career-posts',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <CareerPosts />
                        </RoleRoute>
                    ),
                },
                {
                    path: '/historic',
                    element: <About />,
                },
                {
                    path: '/inventory',
                    element: (
                        <RoleRoute allowedRoles={[...ADMIN_ROLES]}>
                            <Inventory />
                        </RoleRoute>
                    ),
                },
            ],
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ])
    return <RouterProvider router={router} />
}
