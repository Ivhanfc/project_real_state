import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'outline'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide backdrop-blur-md transition-all duration-200'

  const variants = {
    default: 'bg-zinc-200/90 text-zinc-800 border border-black/[0.06]',
    success: 'bg-emerald-100/90 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-100/90 text-amber-800 border border-amber-200',
    info: 'bg-sky-100/90 text-sky-800 border border-sky-200',
    outline: 'border border-zinc-300 text-zinc-700 bg-white/60',
  }

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
