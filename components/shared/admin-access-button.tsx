// src/components/shared/admin-access-button.tsx
"use client"

import { useState } from 'react'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/auth/login-form'

export function AdminAccessButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-4 right-4 z-50">
          <Shield className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accès réservé</DialogTitle>
          <DialogDescription>
            Connectez-vous pour accéder à l'espace d'administration
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="super-admin">Super Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="admin">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Accédez à votre espace d'administration pour gérer les demandes de votre service.
              </p>
              <LoginForm />
            </div>
          </TabsContent>
          <TabsContent value="super-admin">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Accédez à l'espace super administrateur pour gérer l'ensemble de la plateforme.
              </p>
              <LoginForm />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}