import React from 'react'
import { Card as ShadcnCard } from '@/Components/ui/card'
import { cn } from '@/lib/utils'

interface CardProps {
    children: React.ReactNode
    backgroundColor?: string
    borderRadius?: string
    border?: string
    padding?: string
    width?: string | number
    height?: string | number
    flex?: string
    gap?: string | number
    style?: React.CSSProperties
    className?: string
    onClick?: () => void
}

const Card: React.FC<CardProps> = ({
    children,
    backgroundColor,
    borderRadius,
    border,
    padding,
    width,
    height,
    flex,
    gap,
    style,
    className = '',
    onClick,
}) => {
    return (
        <ShadcnCard
            className={cn('overflow-hidden bg-white shadow-sm', className)}
            style={{
                backgroundColor: backgroundColor || undefined,
                borderRadius: borderRadius || '12px',
                border: border || '1px solid #e2e8f0',
                padding: padding || '16px',
                width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
                height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
                flex: flex || undefined,
                gap: gap ? (typeof gap === 'number' ? `${gap}px` : gap) : undefined,
                ...style,
            }}
            onClick={onClick}
        >
            {children}
        </ShadcnCard>
    )
}

export default Card
