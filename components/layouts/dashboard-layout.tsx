// src/components/layouts/dashboard-layout.tsx
"use client"

import { ReactNode } from 'react'
import { Sidebar } from '@/components/shared/sidebar'
// import { Role } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Role } from '@/types'

interface DashboardLayoutProps {
  children: ReactNode
  role: Role
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={role} />
      <main className={cn(
        "transition-all duration-300",
        "md:ml-64", // Ajusté selon la largeur de la sidebar
        "pt-16 md:pt-0" // Espace pour le bouton mobile
      )}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}