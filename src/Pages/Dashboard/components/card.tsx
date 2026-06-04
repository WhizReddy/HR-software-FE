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
        <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-colors duration-200 hover:border-slate-300">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cfg.gradient} shadow-sm`}
                >
                    <Icon size={22} className="text-white" />
                </div>
                <div className="z-10 flex flex-col">
                    <p className="mb-1 text-[11px] font-semibold uppercase text-slate-500">
                        {title}
                    </p>
                    <p className="text-3xl font-semibold leading-none text-slate-950">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CardInfo
