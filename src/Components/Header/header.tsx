import React, { useEffect, useRef, useState } from 'react'
import NotificationDropdown from '../../Pages/Notification/Notification'
import { useAuth } from '@/Context/AuthProvider'
import { Avatar, AvatarFallback } from '@/Components/ui/avatar'
import { SidebarTrigger } from '@/Components/ui/sidebar'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const initials = currentUser
    ? `${currentUser.firstName?.charAt(0) ?? ''}${currentUser.lastName?.charAt(0) ?? ''}`
    : 'U'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  const handleGoToProfile = () => {
    setIsProfileOpen(false)
    if (currentUser?._id) {
      navigate(`/profile/${currentUser._id}`)
      return
    }
    navigate('/dashboard')
  }

  return (
    <header className="sticky top-0 z-20 mx-4 mt-4 flex h-16 items-center justify-between rounded-2xl border border-white/70 bg-white/75 px-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-slate-500 hover:text-slate-700" />
        <div className="hidden md:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <p className="text-sm font-semibold text-slate-700">People Operations Hub</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationDropdown />
        <div ref={profileDropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/90 p-1 pr-2 transition-colors hover:bg-slate-50"
          >
            <Avatar className="h-8 w-8 cursor-pointer bg-gradient-to-br from-[#2457a3] to-[#4A7BCD] text-white shadow-sm">
              <AvatarFallback className="bg-transparent text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Profile options"
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">{currentUser?.email}</p>
              </div>

              <button
                type="button"
                onClick={handleGoToProfile}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <User size={15} />
                My Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
