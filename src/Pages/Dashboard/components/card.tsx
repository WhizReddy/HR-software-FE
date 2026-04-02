import React from 'react'
import { StatusKey, statusConfig } from './statusConfig'

interface CardProps {
    title: StatusKey
    content: string
}

const CardInfo: React.FC<CardProps> = ({ title, content }) => {
    const cfg = statusConfig[title]
    const Icon = cfg.icon

    return (
        <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-5">
                <div
                    className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.gradient} shadow-md transition-shadow duration-300 group-hover:shadow-lg`}
                >
                    <Icon size={24} className="text-white" />
                </div>
                <div className="z-10 flex flex-col">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {title}
                    </p>
                    <p className="bg-clip-text text-4xl font-extrabold leading-none text-slate-800 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 group-hover:text-transparent">
                        {content}
                    </p>
                </div>
            </div>
            <div
                className={`absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br ${cfg.gradient} opacity-[0.08] transition-all duration-500 group-hover:scale-110 group-hover:opacity-15`}
            />
        </div>
    )
}

export default CardInfo
