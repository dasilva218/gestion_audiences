// src/components/auth/protected-route.tsx
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/providers/auth-provider'
// import { Role } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { Role } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Role[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/unauthorized'
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Si pas connecté, rediriger vers login
      if (!user || !profile) {
        router.push('/login')
        return
      }

      // Si des rôles sont spécifiés, vérifier les permissions
      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        router.push(redirectTo)
      }
    }
  }, [user, profile, loading, allowedRoles, router, redirectTo])

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Si pas autorisé, ne rien afficher (la redirection se fera)
  if (!user || !profile || (allowedRoles && !allowedRoles.includes(profile.role))) {
    return null
  }

  return <>{children}</>
}