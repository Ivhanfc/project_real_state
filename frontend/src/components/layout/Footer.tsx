import React from 'react'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white/60 backdrop-blur-sm border-t border-black/[0.08] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-zinc-500 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-zinc-800 hover:text-zinc-950 transition-colors duration-200 group"
          >
            <Building2 className="w-4 h-4 text-zinc-700 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
            <span className="font-semibold tracking-tight">
              Kairo<span className="text-zinc-500 transition-colors duration-200 group-hover:text-zinc-700">State</span>
            </span>
          </Link>
          <span className="hidden sm:inline text-zinc-300 select-none" aria-hidden="true">
            •
          </span>
          <p>© {CURRENT_YEAR} KairoState. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
