import React from 'react'
import { Skeleton } from '@/Components/ui/skeleton'

const EventsContentLoader: React.FC = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm animate-pulse"
                >
                    <Skeleton className="mb-3 h-4 w-3/4 rounded" />
                    <Skeleton className="mb-2 h-3 w-full rounded" />
                    <Skeleton className="mb-4 h-3 w-5/6 rounded" />
                    <div className="flex gap-2">
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default EventsContentLoader
