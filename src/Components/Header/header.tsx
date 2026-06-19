import React, { useEffect, useRef, useState } from 'react'
import NotificationDropdown from '../../Pages/Notification/Notification'
import { useAuth } from '@/features/auth/context/AuthProvider'
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
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="rounded-md border border-transparent p-2 text-slate-500 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700" />
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-slate-800">People Operations Hub</p>
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
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-1 pr-3 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
          >
            <Avatar className="h-8 w-8 cursor-pointer bg-slate-900 text-white">
              <AvatarFallback className="bg-transparent text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-700">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs font-medium capitalize text-slate-500">
                {currentUser?.role ?? 'user'}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              aria-label="Profile options"
              className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-lg shadow-slate-200/50"
            >
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="truncate text-xs text-slate-500">{currentUser?.email}</p>
              </div>

              <button
                type="button"
                onClick={handleGoToProfile}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <User size={15} />
                My Profile
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
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
