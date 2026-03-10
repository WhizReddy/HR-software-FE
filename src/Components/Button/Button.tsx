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
            'bg-[#2457a3] hover:bg-[#1b4285] text-white border border-[#2457a3] focus:ring-[#2457a3] shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-95 transition-all duration-300',
        [ButtonTypes.SECONDARY]:
            'bg-white/80 backdrop-blur-sm hover:bg-slate-50 text-[#2457a3] border border-slate-200 focus:ring-[#2457a3] shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-95 transition-all duration-300',
        [ButtonTypes.DANGER]:
            'bg-red-600 hover:bg-red-700 text-white border border-red-600 focus:ring-red-500 shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-95 transition-all duration-300',
        [ButtonTypes.TERTIARY]:
            'bg-slate-100/80 backdrop-blur-sm hover:bg-slate-200 text-slate-700 border border-slate-200 focus:ring-slate-400 shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-95 transition-all duration-300',
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
                    'min-h-10 rounded-xl px-4 text-sm font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-1',
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
