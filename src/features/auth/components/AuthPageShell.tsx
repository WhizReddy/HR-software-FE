import type { ReactNode } from 'react'
import PublicPageNav from '@/Components/Public/PublicPageNav'

interface AuthPageShellProps {
    heroTitle: ReactNode
    heroDescription: string
    cardTitle: string
    cardDescription: string
    children: ReactNode
    publicActions?: ReactNode
}

export default function AuthPageShell({
    heroTitle,
    heroDescription,
    cardTitle,
    cardDescription,
    children,
    publicActions,
}: AuthPageShellProps) {
    return (
        <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[var(--background)]">
            <div className="grid min-h-screen w-full min-w-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative hidden flex-col justify-center overflow-hidden border-r border-slate-200 bg-slate-100 px-10 py-8 text-slate-950 lg:flex xl:px-14">
                    <div className="max-w-xl">
                        <div className="mb-10 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
                                <h2 className="text-lg font-bold tracking-widest text-white">
                                    PH
                                </h2>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-950">
                                    People Hub
                                </p>
                                <p className="text-sm font-medium text-slate-500">
                                    Recruiter workspace
                                </p>
                            </div>
                        </div>
                        <h1 className="max-w-lg text-5xl font-semibold leading-[1.05] text-slate-950">
                            {heroTitle}
                        </h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
                            {heroDescription}
                        </p>

                        <div className="mt-10 max-w-md border-l border-slate-300 pl-5">
                            <p className="text-sm font-semibold text-slate-900">
                                Built for daily HR work
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Hiring records, interviews, employee details,
                                leave, payroll, and assets stay in the same
                                workspace.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full min-w-0 flex-col items-center justify-start px-4 py-6 sm:justify-center sm:px-10 lg:px-12">
                    {publicActions && (
                        <PublicPageNav
                            contextLabel="Sign in"
                            actions={publicActions}
                            className="mb-5 w-full max-w-[calc(100vw-2rem)] sm:max-w-[440px]"
                        />
                    )}
                    <div className="w-full min-w-0 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[var(--shadow-card)] sm:max-w-[440px] sm:p-10">
                        {!publicActions && (
                            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold tracking-wider text-white shadow-sm">
                                    PH
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        People Hub
                                    </p>
                                    <p className="text-sm font-semibold text-slate-800">
                                        HR operations workspace
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="text-center">
                            <h2 className="mb-2 break-words text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">
                                {cardTitle}
                            </h2>
                            <p className="text-sm font-medium text-slate-500">
                                {cardDescription}
                            </p>
                        </div>

                        <div className="mt-8">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
