import React from 'react'
import { Label } from '@/Components/ui/label'
import { cn } from '@/lib/utils'

interface SelecterProps {
    label?: string
    name?: string
    value?: string | string[]
    onChange?: (value: any) => void
    options?: { value: string; label: string }[] | string[]
    multiple?: boolean
    width?: string | number
    required?: boolean
    disabled?: boolean
    placeholder?: string
}

const Selecter: React.FC<SelecterProps> = ({
    label,
    name,
    value,
    onChange,
    options = [],
    multiple = false,
    width,
    required,
    disabled,
    placeholder,
}) => {
    const normalizedOptions = options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt,
    )

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!onChange) return
        if (multiple) {
            const selected = Array.from(e.target.selectedOptions).map((o) => o.value)
            onChange(selected)
        } else {
            onChange(e.target.value)
        }
    }

    const selectedValue = Array.isArray(value) ? value : value ?? ''

    return (
        <div
            className="flex flex-col gap-1"
            style={{ width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%' }}
        >
            {label && (
                <Label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    {label}
                </Label>
            )}
            <select
                id={name}
                name={name}
                multiple={multiple}
                required={required}
                disabled={disabled}
                value={selectedValue}
                onChange={handleChange}
                className={cn(
                    'w-full rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm px-3 text-sm text-slate-800 shadow-sm hover:shadow-md transition-all duration-300',
                    multiple ? 'min-h-[120px] py-1' : 'h-10 py-2',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                )}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {normalizedOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Selecter
