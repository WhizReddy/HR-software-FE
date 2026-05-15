import React from 'react'
import { Skeleton } from '@/Components/ui/skeleton'

const EventsContentLoader: React.FC = () => {
    return (
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="min-h-[320px] animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                    <Skeleton className="mb-5 h-36 w-full rounded-xl" />
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
