// src/app/account-suspended/page.tsx
import { AlertCircle, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AccountSuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <CardTitle>Compte suspendu</CardTitle>
          </div>
          <CardDescription>
            Votre compte a été temporairement suspendu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Votre accès à la plateforme a été temporairement restreint.
            Cela peut être dû à plusieurs raisons :
          </p>

          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Violation des conditions d'utilisation</li>
            <li>Activité suspecte détectée</li>
            <li>Maintenance du compte</li>
          </ul>

          <div className="pt-4 space-y-3">
            <p className="text-sm font-medium">
              Pour plus d'informations ou pour contester cette décision :
            </p>

            <Button className="w-full" variant="default">
              <Mail className="mr-2 h-4 w-4" />
              Contacter le support
            </Button>

            <Button className="w-full" variant="outline" asChild>
              <Link href="/auth/login">
                Retour à la connexion
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}