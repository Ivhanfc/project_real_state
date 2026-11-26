import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#e6e6eb] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] active:translate-y-0'

  const variants = {
    primary:
      'bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm hover:shadow-md hover:-translate-y-[1px] focus:ring-zinc-900',
    secondary:
      'bg-zinc-200/80 hover:bg-zinc-300/90 text-zinc-900 border border-black/[0.06] backdrop-blur-md hover:-translate-y-[1px] hover:shadow-sm focus:ring-zinc-500',
    outline:
      'bg-white/75 hover:bg-white text-zinc-800 border border-zinc-300/90 hover:border-zinc-400 backdrop-blur-md shadow-xs hover:shadow-sm hover:-translate-y-[1px] focus:ring-zinc-500',
    ghost: 'text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.06]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md hover:-translate-y-[1px] focus:ring-rose-500',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}
