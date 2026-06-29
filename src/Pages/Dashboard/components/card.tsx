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
        <div className="relative min-h-[104px] overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-200 hover:border-slate-300">
            <div className="flex h-full items-start justify-between gap-4">
                <div className="z-10 flex min-w-0 flex-col justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-500">
                        {cfg.label}
                    </p>
                    <p className="text-[28px] font-semibold leading-none text-slate-950">
                        {content}
                    </p>
                </div>
                <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600"
                >
                    <Icon size={20} />
                </div>
            </div>
        </div>
    )
}

export default CardInfo
