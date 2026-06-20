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
        <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f6f7f4] text-slate-950">
            <main className="mx-auto grid min-h-screen w-full max-w-[1040px] items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.82fr_1fr] lg:gap-12 lg:px-8">
                <section className="hidden min-w-0 lg:block">
                    <div className="inline-flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold tracking-widest text-white shadow-sm">
                            PH
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-950">
                                People Hub
                            </p>
                            <p className="text-sm font-medium text-slate-500">
                                HR workspace
                            </p>
                        </div>
                    </div>

                    <h1 className="mt-10 max-w-sm text-4xl font-semibold leading-tight text-slate-950">
                        {heroTitle}
                    </h1>
                    <p className="mt-5 max-w-sm text-base leading-7 text-slate-600">
                        {heroDescription}
                    </p>

                    <div className="mt-10 w-36 border-t border-slate-300" />
                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Private team access
                    </p>
                </section>

                <section className="flex w-full min-w-0 flex-col items-center justify-center">
                    {publicActions && (
                        <PublicPageNav
                            contextLabel="Sign in"
                            actions={publicActions}
                            className="mb-5 w-full max-w-[440px]"
                        />
                    )}
                    <div
                        className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8"
                        style={{
                            maxWidth: 'min(440px, calc(100vw - 2rem))',
                        }}
                    >
                        {!publicActions && (
                            <div className="mb-7 flex items-center gap-3 lg:hidden">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold tracking-wider text-white shadow-sm">
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
                        <div>
                            <h2 className="mb-2 break-words text-2xl font-semibold leading-tight text-slate-950">
                                {cardTitle}
                            </h2>
                            <p className="break-words text-sm font-medium text-slate-500">
                                {cardDescription}
                            </p>
                        </div>

                        <div className="mt-8">{children}</div>
                    </div>
                </section>
            </main>
        </div>
    )
}
