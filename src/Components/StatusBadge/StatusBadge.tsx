import React from 'react'
import { Badge } from '@/Components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
    status: string
    color?: string
}

const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    gray: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, color }) => {
    const classes = color && colorMap[color] ? colorMap[color] : 'bg-slate-100 text-slate-600 border-slate-200'

    return (
        <Badge
            variant="outline"
            className={cn('rounded-full text-xs font-semibold capitalize', classes)}
        >
            {status}
        </Badge>
    )
}
