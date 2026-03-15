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
                'glass-card relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6',
                className,
            )}
        >
            <div className="pointer-events-none absolute -right-16 top-0 h-36 w-36 rounded-full bg-blue-100/60 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-full bg-cyan-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    {eyebrow && (
                        <p className="inline-flex items-center rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
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
