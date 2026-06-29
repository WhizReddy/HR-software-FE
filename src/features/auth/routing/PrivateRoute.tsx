import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { RingLoader } from 'react-spinners'
import { BreadcrumbComponent } from '@/Components/BreadCrumbs/BreadCrumbs'
import Header from '@/Components/Header/header'
import { SideBar } from '@/Components/SideBar/sidebar'
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar'
import { useAuth } from '../context/AuthProvider'

const PrivateRoute = () => {
    const { isAuthenticated, isInitializing } = useAuth()
    const { pathname } = useLocation()
    const contentMaxWidth =
        pathname === '/dashboard' ? 'max-w-[1760px]' : 'max-w-[1400px]'

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow
        const previousHtmlOverflow = document.documentElement.style.overflow
        const previousBodyOverscroll = document.body.style.overscrollBehavior

        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overscrollBehavior = 'none'

        return () => {
            document.body.style.overflow = previousBodyOverflow
            document.documentElement.style.overflow = previousHtmlOverflow
            document.body.style.overscrollBehavior = previousBodyOverscroll
        }
    }, [])

    if (isInitializing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <RingLoader color="#2457A3" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return (
        <SidebarProvider
            defaultOpen
            className="h-dvh min-h-0 overflow-hidden"
        >
            <div className="relative flex h-dvh w-full overflow-hidden bg-slate-50">
                <SideBar />
                <SidebarInset className="flex h-dvh min-w-0 flex-col overflow-hidden bg-transparent">
                    <Header />
                    <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                        <div
                            className={`mx-auto w-full ${contentMaxWidth} px-4 py-5 sm:px-6 lg:px-8`}
                        >
                            <div>
                                <BreadcrumbComponent />
                            </div>
                            <Outlet />
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default PrivateRoute
