// src/app/(admin)/admin/page.tsx
import { redirect } from 'next/navigation'

export default function AdminIndexPage() {
  redirect('/admin/dashboard')
}