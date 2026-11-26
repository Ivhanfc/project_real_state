import React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  className,
  label,
  error,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full group">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-zinc-700 mb-1.5 transition-colors duration-200 group-focus-within:text-zinc-950"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl bg-white/80 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 border border-zinc-300/80 backdrop-blur-md field-smooth hover:border-zinc-400/90 hover:bg-white/95 hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-900/10 focus:shadow-[0_6px_20px_rgba(0,0,0,0.06)] focus:-translate-y-[1px]',
          error && 'border-rose-500 hover:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-600 animate-panel-enter">{error}</p>}
    </div>
  )
}
