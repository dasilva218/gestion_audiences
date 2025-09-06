// src/app/(citoyen)/layout.tsx
import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma/client'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import prisma from '@/lib/prisma/client'
import { supabaseClient } from '@/lib/supabase/client'
import { Role } from '@/types'

// import { Role } from '@prisma/client'

export default async function CitoyenLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const { data: { user } } = await supabaseClient.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!profile || profile.role !== Role.CITOYEN) {
    redirect('/unauthorized')
  }

  return (
    <DashboardLayout role={Role.CITOYEN}>
      {children}
    </DashboardLayout>
  )
}