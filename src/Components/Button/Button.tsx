import React from 'react'
import { ButtonTypes } from './ButtonTypes'
import { Button as ShadcnButton } from '@/Components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    btnText?: string
    type?: ButtonTypes
    onClick?: any
    width?: string | number
    height?: string | number
    padding?: string | number
    color?: string
    backgroundColor?: string
    borderColor?: string
    border?: string
    borderRadius?: string
    cursor?: string
    htmlType?: 'button' | 'submit' | 'reset'
    isSubmit?: boolean
    marginTop?: string | number
    display?: React.CSSProperties['display']
    justifyContent?: React.CSSProperties['justifyContent']
    alignItems?: React.CSSProperties['alignItems']
    icon?: React.ReactNode
    children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    btnText = 'Button',
    type = ButtonTypes.PRIMARY,
    onClick,
    width,
    height,
    padding,
    color,
    backgroundColor,
    borderColor,
    border,
    borderRadius,
    cursor,
    disabled = false,
    className = '',
    htmlType = 'button',
    isSubmit = false,
    marginTop,
    display,
    justifyContent,
    alignItems,
    icon,
    children,
    ...props
}) => {
    const variants = {
        [ButtonTypes.PRIMARY]:
            'border border-[#2457a3] bg-[#2457a3] text-white shadow-md shadow-blue-200/70 hover:-translate-y-[1px] hover:bg-[#1b4285] hover:shadow-lg hover:shadow-blue-200/80 focus-visible:ring-[#2457a3]',
        [ButtonTypes.SECONDARY]:
            'border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus-visible:ring-slate-300',
        [ButtonTypes.DANGER]:
            'border border-red-600 bg-red-600 text-white shadow-md shadow-red-200/70 hover:-translate-y-[1px] hover:bg-red-700 hover:shadow-lg hover:shadow-red-200/80 focus-visible:ring-red-500',
        [ButtonTypes.TERTIARY]:
            'border border-slate-200/80 bg-slate-100/90 text-slate-700 shadow-sm hover:-translate-y-[1px] hover:bg-slate-200 focus-visible:ring-slate-400',
        [ButtonTypes.SUCCESS]:
            'border border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200/70 hover:-translate-y-[1px] hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200/80 focus-visible:ring-emerald-500',
        [ButtonTypes.WARNING]:
            'border border-amber-500 bg-amber-500 text-slate-950 shadow-md shadow-amber-200/80 hover:-translate-y-[1px] hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200/80 focus-visible:ring-amber-400',
        [ButtonTypes.NEUTRAL]:
            'border border-slate-200 bg-slate-100 text-slate-700 shadow-sm hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-200 hover:shadow-md focus-visible:ring-slate-300',
    }

    const inlineStyle: React.CSSProperties = {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        padding: padding ? (typeof padding === 'number' ? `${padding}px` : padding) : '8px 16px',
        color: color || undefined,
        backgroundColor: backgroundColor || undefined,
        borderColor: borderColor || undefined,
        border: border || undefined,
        borderRadius: borderRadius || undefined,
        cursor: cursor || undefined,
        marginTop: marginTop ? (typeof marginTop === 'number' ? `${marginTop}px` : marginTop) : undefined,
        display: display || undefined,
        justifyContent: justifyContent || undefined,
        alignItems: alignItems || undefined,
    }

    const variantClass = variants[type]

    return (
        <ShadcnButton
            type={isSubmit ? 'submit' : htmlType}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'min-h-10 rounded-xl px-4 text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none disabled:opacity-55',
                variantClass,
                className,
            )}
            style={inlineStyle}
            {...props}
        >
            {icon}
            {children ?? btnText}
        </ShadcnButton>
    )
}

export default Button
