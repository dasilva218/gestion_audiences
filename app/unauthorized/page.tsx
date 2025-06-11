// src/app/unauthorized/page.tsx
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle>Accès non autorisé</CardTitle>
          </div>
          <CardDescription>
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Si vous pensez qu'il s'agit d'une erreur, veuillez contacter l'administrateur.
          </p>
          <div className="flex space-x-2">
            <Button asChild variant="default">
              <Link href="/dashboard">
                Retour au tableau de bord
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                Page d'accueil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}