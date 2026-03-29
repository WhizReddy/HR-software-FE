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
        <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />

            <div className="flex w-full min-h-screen z-10">
                <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#2457a3] p-12 relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl isolate" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl isolate" />

                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center mb-12 border border-white/20 shadow-2xl">
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

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-max shadow-xl">
                            <div className="flex -space-x-4">
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-[#2457a3]"
                                    src="https://i.pravatar.cc/100?img=1"
                                    alt="User"
                                />
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-[#2457a3]"
                                    src="https://i.pravatar.cc/100?img=2"
                                    alt="User"
                                />
                                <img
                                    className="w-10 h-10 rounded-full border-2 border-[#2457a3]"
                                    src="https://i.pravatar.cc/100?img=3"
                                    alt="User"
                                />
                            </div>
                            <div className="text-sm text-white font-medium">
                                Trusted by{' '}
                                <span className="font-bold text-emerald-400">
                                    10,000+
                                </span>{' '}
                                professionals
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                    <div className="w-full max-w-md space-y-8 glass-modal p-8 sm:p-10 border border-white/60">
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
