// src/components/shared/sidebar.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  BarChart3,
  Calendar,
  Shield,
  Activity,
  FolderOpen,
  UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Role } from '@/types'
// import { Role } from '@prisma/client'

interface SidebarProps {
  role: Role
}

export function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { profile, signOut } = useAuthContext()

  // Navigation items basés sur le rôle
  const navigationItems = getNavigationItems(role)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link href="/" className={cn(
              "flex items-center space-x-2",
              isCollapsed && "justify-center"
            )}>
              <Building2 className="h-8 w-8 text-blue-400" />
              {!isCollapsed && (
                <span className="font-bold text-xl">GovAudience</span>
              )}
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block p-1 hover:bg-gray-800 rounded"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center w-full hover:bg-gray-800 rounded-lg p-2 transition-colors",
                  isCollapsed && "justify-center"
                )}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>
                      {profile?.prenom?.[0]}{profile?.nom?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <>
                      <div className="ml-3 text-left flex-1">
                        <p className="text-sm font-medium">{profile?.prenom} {profile?.nom}</p>
                        <p className="text-xs text-gray-400">{getRoleLabel(role)}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserCog className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  isCollapsed && "justify-center"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5", isCollapsed ? "h-6 w-6" : "")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => signOut()}
              className={cn(
                "flex items-center space-x-3 w-full px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// Helper functions
function getNavigationItems(role: Role) {
  switch (role) {
    case Role.CITOYEN:
      return [
        { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { href: '/demandes', label: 'Mes demandes', icon: FileText },
        { href: '/demandes/nouvelle', label: 'Nouvelle demande', icon: FolderOpen },
        { href: '/calendrier', label: 'Mes rendez-vous', icon: Calendar },
        { href: '/notifications', label: 'Notifications', icon: Bell },
      ]

    case Role.ADMIN:
      return [
        { href: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { href: '/admin/demandes', label: 'Demandes à traiter', icon: FileText },
        { href: '/admin/audiences', label: 'Audiences planifiées', icon: Calendar },
        { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
        { href: '/admin/administration', label: 'Mon administration', icon: Building2 },
      ]

    case Role.SUPER_ADMIN:
      return [
        { href: '/super-admin/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { href: '/super-admin/administrations', label: 'Administrations', icon: Building2 },
        { href: '/super-admin/utilisateurs', label: 'Utilisateurs', icon: Users },
        { href: '/super-admin/demandes', label: 'Toutes les demandes', icon: FileText },
        { href: '/super-admin/statistiques', label: 'Statistiques', icon: BarChart3 },
        { href: '/super-admin/activites', label: 'Journal d\'activité', icon: Activity },
        { href: '/super-admin/parametres', label: 'Paramètres', icon: Settings },
      ]

    default:
      return []
  }
}

function getRoleLabel(role: Role) {
  switch (role) {
    case Role.CITOYEN:
      return 'Citoyen'
    case Role.ADMIN:
      return 'Administrateur'
    case Role.SUPER_ADMIN:
      return 'Super Administrateur'
    default:
      return ''
  }
}