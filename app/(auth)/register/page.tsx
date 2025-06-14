//app/(auth)/register/page.tsx
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-center">
            Inscrivez-vous pour soumettre des demandes d'audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-600 text-center">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Connectez-vous
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}