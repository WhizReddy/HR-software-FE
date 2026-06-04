import type { ReactNode } from 'react'

interface AuthPageShellProps {
    heroTitle: ReactNode
    heroDescription: string
    cardTitle: string
    cardDescription: string
    children: ReactNode
}

export default function AuthPageShell({
    heroTitle,
    heroDescription,
    cardTitle,
    cardDescription,
    children,
}: AuthPageShellProps) {
    return (
        <div className="min-h-screen w-full bg-[#f5f7fb]">
            <div className="grid min-h-screen w-full lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,#174f98_0%,#2457a3_48%,#0f766e_100%)] px-12 py-10 text-white lg:flex xl:px-16">
                    <div className="max-w-xl">
                        <div className="mb-14 flex h-12 w-12 items-center justify-center rounded-lg border border-white/25 bg-white/15 shadow-[0_1px_2px_rgba(15,23,42,0.12)]">
                            <h2 className="text-xl font-bold tracking-widest text-white">
                                HR
                            </h2>
                        </div>
                        <h1 className="max-w-lg text-5xl font-semibold leading-[1.05] text-white">
                            {heroTitle}
                        </h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-blue-100/85">
                            {heroDescription}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-white">
                        {[
                            ['People', 'Directory'],
                            ['Hiring', 'Pipeline'],
                            ['Assets', 'Inventory'],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-lg border border-white/20 bg-white/10 p-4 shadow-[0_1px_1px_rgba(15,23,42,0.08)]"
                            >
                                <p className="text-[11px] font-semibold uppercase text-blue-100">
                                    {label}
                                </p>
                                <p className="mt-2 text-sm font-bold">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
                    <div className="w-full max-w-[440px] rounded-lg border border-slate-200/80 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-10">
                        <div className="text-center">
                            <h2 className="mb-2 text-3xl font-semibold text-slate-950">
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
