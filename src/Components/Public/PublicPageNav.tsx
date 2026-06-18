import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const publicButtonClasses = {
    primary:
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2457a3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4285] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/25',
    secondary:
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/20',
    navLink:
        'inline-flex min-h-11 items-center rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/20',
}

type PublicPageNavItem = {
    href: string
    label: string
}

type PublicPageNavProps = {
    contextLabel: string
    actions?: ReactNode
    className?: string
    navItems?: PublicPageNavItem[]
}

export default function PublicPageNav({
    contextLabel,
    actions,
    className,
    navItems = [],
}: PublicPageNavProps) {
    return (
        <nav
            className={cn(
                'flex w-full flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2457a3] text-sm font-bold tracking-wider text-white shadow-sm">
                    PH
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        People Hub
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-800">
                        {contextLabel}
                    </p>
                </div>
            </div>

            {(navItems.length > 0 || actions) && (
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={publicButtonClasses.navLink}
                        >
                            {item.label}
                        </a>
                    ))}
                    {actions}
                </div>
            )}
        </nav>
    )
}
