import { Navigate, Outlet } from 'react-router-dom'
import { SideBar } from '@/Components/SideBar/sidebar'
import { BreadcrumbComponent } from '@/Components/BreadCrumbs/BreadCrumbs'
import Header from '@/Components/Header/header'
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar'
import { useAuth } from './AuthProvider'

const PrivateRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-svh w-full bg-slate-50/50">
          <SideBar />
          <SidebarInset className="min-w-0 bg-transparent flex flex-col pt-4">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              <BreadcrumbComponent />
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  )
}

export default PrivateRoute
