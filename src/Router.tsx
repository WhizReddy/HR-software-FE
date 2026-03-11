import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ViewCandidats from './Pages/VIewCandidats/ViewCandidats.tsx'
import PrivateRoute from './Context/ProtectedRoute.tsx'
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
import Holdings from './Pages/Holdings/Holdings.tsx'
import Vacation from './Pages/Vacation/Vacation.tsx'
import SpecificUserPayroll from './Pages/Payroll/SpecificUser/SpecificUserPayroll.tsx'
import About from './Pages/About/About.tsx'
import UserVacations from './Pages/Vacation/UserVacations.tsx'
import EmailConfirmation from './Pages/Recruitment/Component/EmailConfirmation.tsx'
import NotFound from './Pages/NotFound/NotFound.tsx'

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
            path: '/recrutiment',
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
                    element: <ViewCandidats />,
                },
                {
                    path: '/holdings',
                    element: <Holdings />,
                },
                {
                    path: '/vacation',
                    element: <Vacation />,
                },
                {
                    path: '/vacation/:id',
                    element: <UserVacations />,
                },
                {
                    path: '/payroll/user/:id',
                    element: <SpecificUserPayroll />,
                },
                {
                    path: '/payroll',
                    element: <Payroll />,
                },
                {
                    path: '/candidates',
                    element: <Candidates />,
                },
                {
                    path: '/events',
                    element: <Events />,
                },
                {
                    path: '/interview',
                    element: <Interview />,
                },
                {
                    path: '/historic',
                    element: <About />,
                },
                {
                    path: '/inventory',
                    element: <Inventory />,
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
