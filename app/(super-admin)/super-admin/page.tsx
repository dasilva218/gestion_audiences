// src/app/(super-admin)/super-admin/page.tsx
import { redirect } from 'next/navigation'

export default function SuperAdminIndexPage() {
  redirect('/super-admin/dashboard')
}