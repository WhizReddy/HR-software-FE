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
import type { LucideIcon } from 'lucide-react'
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

type NavItem = {
  label: string
  path: string
  icon: LucideIcon
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const adminNavGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Analytics', path: '/historic', icon: BarChart2 },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Employees', path: '/employees', icon: Users },
      { label: 'Vacation', path: '/vacation', icon: CalendarCheck },
      { label: 'Payroll', path: '/payroll', icon: CreditCard },
    ],
  },
  {
    label: 'Hiring',
    items: [
      { label: 'Candidates', path: '/candidates', icon: UserCheck },
      { label: 'Interviews', path: '/interview', icon: Briefcase },
      { label: 'Career Posts', path: '/career-posts', icon: Megaphone },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Events', path: '/events', icon: Calendar },
      { label: 'Assets', path: '/holdings', icon: Handshake },
      { label: 'Inventory', path: '/inventory', icon: Package },
    ],
  },
]

const devNavGroups: NavGroup[] = [
  {
    label: 'Self Service',
    items: [
      { label: 'My Assets', path: '/holdings', icon: Handshake },
      { label: 'My Vacation', path: '/my-vacation', icon: CalendarCheck },
    ],
  },
]

export const SideBar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout } = useAuth()
  const rawNavGroups = isAdminRole(currentUser?.role) ? adminNavGroups : devNavGroups
  const navGroups = rawNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) =>
      item.path === '/my-vacation'
        ? { ...item, path: `/vacation/${currentUser?._id}` }
        : item
    ),
  }))

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 bg-white"
    >
      <SidebarHeader className="h-16 justify-center border-b border-slate-100 px-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-bold text-white shadow-sm">
            PH
          </div>
          <span className="truncate text-base font-semibold text-slate-900 group-data-[collapsible=icon]:hidden">
            People <span className="text-slate-500">Hub</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-2 pt-3">
            <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase text-slate-400">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(({ label, path, icon: Icon }) => {
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
                          ? 'bg-slate-100 text-slate-950 shadow-none hover:bg-slate-100 hover:text-slate-950'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarSeparator className="mx-0" />
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
