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
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-200 hover:border-slate-300">
            <div className="flex items-center gap-4">
                <div
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600"
                >
                    <Icon size={22} />
                </div>
                <div className="z-10 flex flex-col">
                    <p className="mb-1 text-sm font-medium text-slate-500">
                        {cfg.label}
                    </p>
                    <p className="text-2xl font-semibold leading-none text-slate-950">
                        {content}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CardInfo
