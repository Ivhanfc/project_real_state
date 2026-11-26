import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div className="relative min-h-screen flex flex-col bg-[#e6e6eb] text-[#1d1d1f] overflow-x-clip">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-white/80 rounded-full blur-[110px]" />
        <div className="absolute top-1/4 -right-24 w-[480px] h-[480px] bg-zinc-400/35 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[560px] h-[560px] bg-slate-300/60 rounded-full blur-[130px]" />
        <div className="absolute top-2/3 -left-16 w-80 h-80 bg-zinc-500/20 rounded-full blur-[100px]" />
      </div>

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
