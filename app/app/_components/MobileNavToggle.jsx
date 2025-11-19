"use client"
import React, { useContext } from 'react'
import { Menu } from 'lucide-react'
import { MobileNavContext } from '../layout'

function MobileNavToggle() {
  const { showBottomNav, setShowBottomNav } = useContext(MobileNavContext)

  if (showBottomNav) return null

  return (
    <button
      onClick={() => setShowBottomNav(true)}
      className="fixed bottom-4 right-4 z-50 md:hidden bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors"
      title="Show navigation"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}

export default MobileNavToggle

