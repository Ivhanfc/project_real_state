import React from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  className,
  hover = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl overflow-hidden text-[#1d1d1f]',
        hover &&
          'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.09)] hover:bg-white/90',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
