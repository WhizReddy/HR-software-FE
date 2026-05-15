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
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 hover:border-slate-300">
            <div className="flex items-center gap-5">
                <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-sm`}
                >
                    <Icon size={22} className="text-white" />
                </div>
                <div className="z-10 flex flex-col">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {title}
                    </p>
                    <p className="text-3xl font-bold leading-none text-slate-900">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CardInfo
