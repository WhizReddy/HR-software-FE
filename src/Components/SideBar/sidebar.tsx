import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  UserCheck,
  Calendar,
  Package,
  BarChart2,
  LogOut,
  Handshake,
  Megaphone,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/Components/ui/sidebar'

const adminNavItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Candidates', path: '/candidates', icon: UserCheck },
  { label: 'Interview', path: '/interview', icon: Briefcase },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'Career Posts', path: '/career-posts', icon: Megaphone },
  { label: 'Payroll', path: '/payroll', icon: CreditCard },
  { label: 'Vacation', path: '/vacation', icon: CalendarCheck },
  { label: 'Holdings', path: '/holdings', icon: Handshake },
  { label: 'Inventory', path: '/inventory', icon: Package },
  { label: 'Stats', path: '/historic', icon: BarChart2 },
]

const devNavItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'My Assets', path: '/holdings', icon: Handshake },
  { label: 'My Vacation', path: '/my-vacation', icon: CalendarCheck },
]

export const SideBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const rawNavItems = isAdminRole(currentUser?.role) ? adminNavItems : devNavItems
  const navItems = rawNavItems.map((item) =>
    item.path === '/my-vacation'
      ? { ...item, path: `/vacation/${currentUser?._id}` }
      : item
  )

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/70 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
    >
      <SidebarHeader className="h-16 justify-center border-b border-slate-100/80 px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2457a3] via-[#2f67ba] to-[#5d8add] text-sm font-bold text-white shadow-md shadow-blue-300/40">
            E
          </div>
          <span className="truncate text-base font-bold tracking-tight text-slate-800 group-data-[collapsible=icon]:hidden">
            PEOPLE <span className="text-[#2457a3]">HUB</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 pt-4">
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive =
                location.pathname === path ||
                (path !== '/dashboard' && location.pathname.startsWith(path))
              return (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={label}
                    onClick={() => navigate(path)}
                    className={
                      isActive
                        ? 'bg-gradient-to-r from-[#2457a3] to-[#3c6fc0] text-white shadow-md shadow-blue-300/40 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} className="shrink-0" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
