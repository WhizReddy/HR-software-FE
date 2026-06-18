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
                'relative w-full max-w-full overflow-hidden rounded-lg border border-slate-200/80 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6',
                className,
            )}
        >
            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div className="min-w-0 max-w-3xl">
                    {eyebrow && (
                        <p className="text-[11px] font-semibold uppercase text-slate-500">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="mt-2 text-2xl font-semibold text-slate-950 sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
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
