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
} from 'lucide-react'
import { useAuth } from '@/Context/AuthProvider'

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

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Candidates', path: '/candidates', icon: UserCheck },
  { label: 'Interview', path: '/interview', icon: Briefcase },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'Payroll', path: '/payroll', icon: CreditCard },
  { label: 'Vacation', path: '/vacation', icon: CalendarCheck },
  { label: 'Holdings', path: '/holdings', icon: Handshake },
  { label: 'Inventory', path: '/inventory', icon: Package },
  { label: 'Stats', path: '/historic', icon: BarChart2 },
]

export const SideBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 bg-white">
      <SidebarHeader className="h-14 justify-center border-b border-slate-100 px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2457a3] to-[#4A7BCD] text-sm font-bold text-white shadow-sm">
            E
          </div>
          <span className="truncate text-base font-bold tracking-tight text-slate-800 group-data-[collapsible=icon]:hidden">
            CRM <span className="text-[#2457a3]">HR</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname.startsWith(path)
              return (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={label}
                    onClick={() => navigate(path)}
                    className={isActive ? 'bg-[#2457a3] text-white hover:bg-[#2457a3]/90 hover:text-white' : 'text-slate-600'}
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="text-slate-500 hover:bg-red-50 hover:text-red-500"
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
