import React from 'react'
import { cn } from '@/lib/utils'

interface PageIntroProps {
    eyebrow?: string
    title: string
    description?: string
    actions?: React.ReactNode
    className?: string
}

export const PageIntro: React.FC<PageIntroProps> = ({
    eyebrow,
    title,
    description,
    actions,
    className,
}) => {
    return (
        <section
            className={cn(
                'w-full max-w-full px-1 py-1 sm:px-0',
                className,
            )}
        >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div className="min-w-0 max-w-3xl">
                    {eyebrow && (
                        <p className="text-sm font-medium text-slate-500">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-600">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex max-w-full flex-wrap items-center gap-3 lg:justify-end">
                        {actions}
                    </div>
                )}
            </div>
        </section>
    )
}

export default PageIntro
