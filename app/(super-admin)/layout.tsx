// src/app/(super-admin)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { Role } from '@prisma/client'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!profile || profile.role !== Role.SUPER_ADMIN) {
    redirect('/unauthorized')
  }

  return (
    <DashboardLayout role={Role.SUPER_ADMIN}>
      {children}
    </DashboardLayout>
  )
}