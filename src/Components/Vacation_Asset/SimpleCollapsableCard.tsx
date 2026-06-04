import React, { useState } from 'react'
import { ChevronDown, ChevronUp, User } from 'lucide-react'

interface Item {
    _id: string
    type: string
}

interface UserData {
    _id: string
    firstName: string
    lastName: string
    imageUrl?: string
    role?: string
    [key: string]: unknown
}

interface SimpleCollapsableCardProps {
    user: UserData
    searchParams?: URLSearchParams
    setSearchParams?: (fn: (prev: URLSearchParams) => URLSearchParams) => void
    items?: {
        type: 'Vacation' | 'Holding'
        itemArr: Item[]
    }
    children?: React.ReactNode
}

const SimpleCollapsableCard: React.FC<SimpleCollapsableCardProps> = ({
    user,
    items,
    children,
}) => {
    const [expanded, setExpanded] = useState(false)

    const itemCount = items?.itemArr?.length ?? 0

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all">
            {/* Header row */}
            <button
                type="button"
                aria-expanded={expanded}
                className="flex w-full cursor-pointer flex-col gap-3 px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/25 sm:flex-row sm:items-center sm:justify-between"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <div className="flex min-w-0 items-center gap-3">
                    {user.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-9 w-9 rounded-md border border-slate-200 object-cover"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                            <User size={18} />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 break-words">
                            {user.firstName} {user.lastName}
                        </p>
                        {user.role && (
                            <p className="text-xs text-slate-500 capitalize break-words">{user.role}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                    {items && (
                        <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            {itemCount} {items.type}
                            {itemCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    <div className="text-slate-400">
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </button>

            {/* Expanded content */}
            {expanded && children && (
                <div className="border-t border-slate-100">{children}</div>
            )}
        </div>
    )
}

export default SimpleCollapsableCard
