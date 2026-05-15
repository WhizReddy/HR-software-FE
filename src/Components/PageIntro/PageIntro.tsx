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
                'relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6',
                className,
            )}
        >
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    {eyebrow && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2457a3]">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            {description}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex flex-wrap items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </section>
    )
}

export default PageIntro
