import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

export type ScrollRevealVariant = 'up' | 'scale' | 'fade' | 'left' | 'right'

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ScrollRevealVariant
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

const shouldSkipAnimation = (): boolean =>
  typeof window === 'undefined' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  !('IntersectionObserver' in window)

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  variant = 'up',
  delay = 0,
  duration = 700,
  threshold = 0.06,
  once = true,
  style,
  ...props
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState<boolean>(shouldSkipAnimation)

  useEffect(() => {
    const el = ref.current
    if (!el || shouldSkipAnimation()) return

    let rafId: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            rafId = window.requestAnimationFrame(() => {
              setIsVisible(true)
            })
            if (once) {
              observer.unobserve(entry.target)
            }
          } else if (!once) {
            setIsVisible(false)
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -36px 0px',
      }
    )

    observer.observe(el)

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      observer.disconnect()
    }
  }, [threshold, once])

  return (
    <div
      ref={ref}
      data-variant={variant}
      className={cn('scroll-reveal', isVisible && 'is-visible', className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
