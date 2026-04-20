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
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all">
            {/* Header row */}
            <div
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <div className="flex min-w-0 items-center gap-3">
                    {user.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
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
                        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                            {itemCount} {items.type}
                            {itemCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    <div className="text-slate-400">
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {/* Expanded content */}
            {expanded && children && (
                <div className="border-t border-slate-100">{children}</div>
            )}
        </div>
    )
}

export default SimpleCollapsableCard
