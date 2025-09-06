// src/app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import prisma from '@/lib/prisma/client'
import { supabaseClient } from '@/lib/supabase/client'
import { Role } from '@/types'


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { data: { user } } = await supabaseClient.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!profile || ![Role.ADMIN, Role.SUPER_ADMIN].includes(profile.role)) {
    redirect('/unauthorized')
  }

  return (
    <DashboardLayout role={profile.role}>
      {children}
    </DashboardLayout>
  )
}