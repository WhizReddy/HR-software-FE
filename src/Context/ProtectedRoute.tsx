import { Navigate, Outlet } from 'react-router-dom'
import { SideBar } from '@/Components/SideBar/sidebar'
import { BreadcrumbComponent } from '@/Components/BreadCrumbs/BreadCrumbs'
import Header from '@/Components/Header/header'
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar'

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('access_token')

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-svh w-full bg-[var(--bg-color)]">
        <SideBar />
        <SidebarInset className="min-w-0 bg-[var(--bg-color)]">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <BreadcrumbComponent />
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default PrivateRoute
