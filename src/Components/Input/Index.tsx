import React from 'react'
import { Input as ShadcnInput } from '@/Components/ui/input'
import { Textarea } from '@/Components/ui/textarea'
import { Label } from '@/Components/ui/label'
import { cn } from '@/lib/utils'

interface InputProps {
    label?: string
    name?: string
    type?: string
    value?: string | number
    onChange?: (e: any) => void
    placeholder?: string
    width?: number | string
    icon?: React.ReactNode
    iconPosition?: 'start' | 'end'
    IsUsername?: boolean
    required?: boolean
    disabled?: boolean
    min?: string | number
    max?: string | number
    step?: string | number
    className?: string
    readOnly?: boolean
    multiline?: boolean
    rows?: number
    style?: React.CSSProperties
    initialValue?: string
    shrink?: boolean
    isPassword?: boolean
    isCheckBox?: boolean
    isFilter?: boolean
    marginTop?: string | number
    height?: string | number
}

const Input: React.FC<InputProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    width,
    icon,
    iconPosition = 'end',
    IsUsername,
    required,
    disabled,
    min,
    max,
    step,
    className = '',
    readOnly,
    multiline = false,
    rows = 3,
    style,
    initialValue,
    isPassword,
    isCheckBox,
    marginTop,
    height,
}) => {
    const computedPlaceholder = placeholder || (IsUsername ? label : placeholder)
    const resolvedType = isPassword ? 'password' : type

    const sharedClasses = cn(
        'bg-white/80 backdrop-blur-md border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 shadow-sm hover:bg-white hover:shadow-md transition-all duration-300',
        icon && iconPosition === 'start' ? 'pl-10' : '',
        icon && iconPosition === 'end' ? 'pr-10' : '',
        resolvedType === 'datetime-local' ? 'block w-full min-h-[40px] [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer' : ''
    )

    return (
        <div
            className={`flex flex-col gap-1 ${className}`}
            style={{
                width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
                marginTop: marginTop
                    ? typeof marginTop === 'number'
                        ? `${marginTop}px`
                        : marginTop
                    : undefined,
                ...style,
            }}
        >
            {label && (
                <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {label}
                </Label>
            )}
            <div className="relative flex items-center">
                {icon && iconPosition === 'start' && (
                    <div className="absolute left-3 pointer-events-none text-slate-400">{icon}</div>
                )}
                {multiline ? (
                    <Textarea
                        id={name}
                        name={name}
                        value={value ?? initialValue ?? ''}
                        onChange={onChange}
                        placeholder={computedPlaceholder}
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                        rows={rows}
                        className={cn('text-sm', sharedClasses)}
                    />
                ) : (
                    <ShadcnInput
                        id={name}
                        name={name}
                        type={isCheckBox ? 'checkbox' : resolvedType}
                        value={value ?? initialValue ?? ''}
                        onChange={onChange}
                        onFocus={(e) => {
                            if (resolvedType === 'datetime-local' && 'showPicker' in e.target) {
                                try {
                                    (e.target as any).showPicker();
                                } catch (err) {
                                    console.error('Error showing picker:', err);
                                }
                            }
                        }}
                        onClick={(e) => {
                            if (resolvedType === 'datetime-local' && 'showPicker' in e.target) {
                                try {
                                    (e.target as any).showPicker();
                                } catch (err) {
                                    console.error('Error showing picker:', err);
                                }
                            }
                        }}
                        placeholder={computedPlaceholder}
                        required={required}
                        disabled={disabled}
                        readOnly={readOnly}
                        min={min}
                        max={max}
                        step={step}
                        className={cn('text-sm', sharedClasses, isCheckBox ? 'h-4 w-4' : '')}
                        style={{
                            height: height
                                ? typeof height === 'number'
                                    ? `${height}px`
                                    : height
                                : undefined,
                        }}
                    />
                )}
                {icon && iconPosition === 'end' && (
                    <div className="absolute right-3 pointer-events-none text-slate-400">{icon}</div>
                )}
            </div>
        </div>
    )
}

export default Input
