// src/components/shared/navbar.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Building2, LogIn, UserPlus, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#fonctionnalites', label: 'Fonctionnalités' },
    { href: '#processus', label: 'Comment ça marche' },
    { href: '#statistiques', label: 'Statistiques' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm border-b"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">
              GovAudience
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  isScrolled ? "text-gray-700" : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                S'inscrire
              </Link>
            </Button>
            <div className="relative group">
              <Button variant="outline" size="icon">
                <Shield className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Espace Admin
                  </Link>
                  <Link
                    href="/super-admin/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Espace Super Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-md rounded-b-lg">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-4 text-sm hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t mt-4 pt-4 px-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/auth/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  S'inscrire
                </Link>
              </Button>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-2">Espace réservé</p>
                <Link
                  href="/admin/dashboard"
                  className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                >
                  → Espace Admin
                </Link>
                <Link
                  href="/super-admin/dashboard"
                  className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                >
                  → Espace Super Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}