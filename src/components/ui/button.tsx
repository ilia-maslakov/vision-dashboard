import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none px-3 py-1.5'

    const variants = {
      default: 'bg-white text-black border border-zinc-600 hover:bg-zinc-200',
      destructive: 'bg-red-600 text-white border border-red-700 hover:bg-red-500',
      outline: 'border border-white text-white bg-transparent hover:bg-white hover:text-black',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
