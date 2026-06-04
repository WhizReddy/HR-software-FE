import { Navigate, Outlet } from 'react-router-dom'
import { RingLoader } from 'react-spinners'
import { BreadcrumbComponent } from '@/Components/BreadCrumbs/BreadCrumbs'
import Header from '@/Components/Header/header'
import { SideBar } from '@/Components/SideBar/sidebar'
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar'
import { useAuth } from '../context/AuthProvider'

const PrivateRoute = () => {
    const { isAuthenticated, isInitializing } = useAuth()

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
        <SidebarProvider defaultOpen>
            <div className="relative flex h-svh w-full overflow-hidden bg-[#f5f7fb]">
                <SideBar />
                <SidebarInset className="flex h-svh min-w-0 flex-col overflow-hidden bg-transparent">
                    <Header />
                    <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-[1440px]">
                            <BreadcrumbComponent />
                            <Outlet />
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default PrivateRoute
