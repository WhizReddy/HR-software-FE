import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-[#2457a3] bg-[#2457a3] text-white shadow-md shadow-blue-200/70 hover:-translate-y-[1px] hover:bg-[#1b4285] hover:shadow-lg hover:shadow-blue-200/80',
        destructive:
          'border border-red-600 bg-red-600 text-white shadow-md shadow-red-200/70 hover:-translate-y-[1px] hover:bg-red-700 hover:shadow-lg hover:shadow-red-200/80',
        outline:
          'border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
        secondary:
          'border border-slate-200/80 bg-slate-100 text-slate-700 shadow-sm hover:-translate-y-[1px] hover:bg-slate-200',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        link: 'text-[#2457a3] underline-offset-4 hover:text-[#1b4285] hover:underline',
        success:
          'border border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-200/70 hover:-translate-y-[1px] hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200/80',
        warning:
          'border border-amber-500 bg-amber-500 text-slate-950 shadow-md shadow-amber-200/80 hover:-translate-y-[1px] hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-sm',
        lg: 'h-11 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
