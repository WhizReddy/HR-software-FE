import React from 'react'
import NotificationDropdown from '../../Pages/Notification/Notification'
import { useAuth } from '@/Context/AuthProvider'
import { Avatar, AvatarFallback } from '@/Components/ui/avatar'
import { SidebarTrigger } from '@/Components/ui/sidebar'

export const Header: React.FC = () => {
  const { currentUser } = useAuth()

  const initials = currentUser
    ? `${currentUser.firstName?.charAt(0) ?? ''}${currentUser.lastName?.charAt(0) ?? ''}`
    : 'U'

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-100 bg-white px-5 shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
      <SidebarTrigger className="text-slate-500 hover:text-slate-700" />

      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <Avatar className="h-8 w-8 cursor-pointer bg-gradient-to-br from-[#2457a3] to-[#4A7BCD] text-white shadow-sm">
          <AvatarFallback className="bg-transparent text-xs font-bold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default Header
