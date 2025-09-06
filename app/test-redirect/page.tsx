// src/app/test-redirect/page.tsx
"use client"

import { useAuthContext } from '@/components/providers/auth-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestRedirectPage() {
  const { user, profile, getDefaultRoute } = useAuthContext()

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Non connecté</CardTitle>
            <CardDescription>Veuillez vous connecter pour tester les redirections</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test de redirection</CardTitle>
          <CardDescription>Informations sur votre compte et redirection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Nom complet</p>
            <p className="font-medium">{profile.prenom} {profile.nom}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Rôle</p>
            <Badge>{profile.role}</Badge>
          </div>

          <div>
            <p className="text-sm text-gray-600">Route par défaut</p>
            <p className="font-medium">{getDefaultRoute()}</p>
          </div>

          <div className="pt-4 space-y-2">
            <Button
              className="w-full"
              onClick={() => window.location.href = getDefaultRoute()}
            >
              Aller au tableau de bord
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Vous devriez être automatiquement redirigé vers cette page après connexion
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}