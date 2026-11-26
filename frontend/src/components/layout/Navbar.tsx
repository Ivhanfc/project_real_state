import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, PlusCircle } from 'lucide-react'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/propiedades' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md backdrop-saturate-125 border-b transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled
          ? 'bg-white/75 border-black/[0.09] shadow-[0_8px_28px_rgba(0,0,0,0.06)]'
          : 'bg-white/60 border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-semibold text-lg text-[#1d1d1f] group">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-zinc-800 group-hover:scale-105 group-active:scale-95">
            <Building2 className="w-4 h-4 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <span className="tracking-tight font-bold transition-colors duration-200">
            Kairo<span className="text-zinc-500 transition-colors duration-200 group-hover:text-zinc-700">State</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] ${
                  isActive
                    ? 'text-white bg-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-black/[0.06]'
                }`}
              >
                {link.name}
              </Link>
            )
          })}

          <Link
            to="/nueva-propiedad"
            className="ml-2 inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm hover:shadow-md hover:-translate-y-[1px] active:scale-[0.97] active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Publicar</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
