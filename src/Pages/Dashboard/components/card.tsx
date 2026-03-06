import React from 'react'
import { User, UserX, Clock, Monitor } from 'lucide-react'

type IconType = 'Present' | 'Absent' | 'On Leave' | 'Remote'

interface CardProps {
    title: string
    content: string
    icon: IconType
}

const configs = {
    Present: {
        icon: User,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        ring: 'ring-emerald-100',
        gradient: 'from-emerald-500 to-green-400',
    },
    Absent: {
        icon: UserX,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        ring: 'ring-blue-100',
        gradient: 'from-blue-500 to-indigo-400',
    },
    'On Leave': {
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        ring: 'ring-amber-100',
        gradient: 'from-amber-500 to-orange-400',
    },
    Remote: {
        icon: Monitor,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        ring: 'ring-purple-100',
        gradient: 'from-purple-500 to-violet-400',
    },
}

const CardInfo: React.FC<CardProps> = ({ title, content, icon }) => {
    const cfg = configs[icon]
    const Icon = cfg.icon

    return (
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl shadow-slate-200/40 p-6 flex items-center gap-5 hover:bg-white hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
            {/* Icon bubble */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${cfg.gradient} shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                <Icon size={24} className="text-white" />
            </div>
            {/* Text */}
            <div className="flex flex-col z-10">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                <p className="text-4xl font-extrabold text-slate-800 leading-none group-hover:text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-600 transition-all duration-300">{content}</p>
            </div>
            {/* Decorative circle */}
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-[0.08] group-hover:opacity-15 group-hover:scale-110 transition-all duration-500 bg-gradient-to-br ${cfg.gradient}`} />
        </div>
    )
}

export default CardInfo
