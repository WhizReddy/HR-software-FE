import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorTextProps {
    message?: string
    children?: React.ReactNode
    className?: string
}

export const ErrorText: React.FC<ErrorTextProps> = ({ message, children, className }) => {
    const content = message || children
    if (!content) return null

    return (
        <p className={`mt-1 flex items-center gap-1 text-xs text-red-500 ${className || ''}`}>
            <AlertCircle size={12} />
            <span>{content}</span>
        </p>
    )
}
