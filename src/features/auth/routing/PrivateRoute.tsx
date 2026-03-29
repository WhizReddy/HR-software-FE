import { Navigate, Outlet } from 'react-router-dom'
import { BreadcrumbComponent } from '@/Components/BreadCrumbs/BreadCrumbs'
import Header from '@/Components/Header/header'
import { SideBar } from '@/Components/SideBar/sidebar'
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar'
import { useAuth } from '../context/AuthProvider'

const PrivateRoute = () => {
    const { isAuthenticated, isInitializing } = useAuth()

    if (isInitializing) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    return (
        <SidebarProvider defaultOpen>
            <div className="relative flex min-h-svh w-full overflow-hidden bg-slate-100">
                <div className="pointer-events-none absolute -top-40 right-[-8rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.26),_transparent_65%)]" />
                <div className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.18),_transparent_70%)]" />
                <SideBar />
                <SidebarInset className="min-w-0 bg-transparent flex flex-col">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                        <div className="mx-auto max-w-[1500px]">
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
