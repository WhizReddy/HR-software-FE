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
        <div className="min-h-screen w-full bg-slate-100">
            <div className="flex min-h-screen w-full">
                <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#2457a3] p-12 lg:flex">
                    <div>
                        <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                            <h2 className="text-2xl font-extrabold text-white tracking-widest">
                                HR
                            </h2>
                        </div>
                        <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            {heroTitle}
                        </h1>
                        <p className="text-blue-100/80 text-lg max-w-md font-light">
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
                                className="rounded-2xl border border-white/15 bg-white/10 p-4"
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100">
                                    {label}
                                </p>
                                <p className="mt-2 text-sm font-bold">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                    <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                                {cardTitle}
                            </h2>
                            <p className="text-slate-500 font-medium">
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
