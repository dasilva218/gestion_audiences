
// src/hooks/useAuth.ts
import { createClient } from '@/lib/supabase/client'
import { Role, User } from '@/types'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import { User, Role } from '@prisma/client'

interface AuthState {
  user: SupabaseUser | null
  profile: User | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Vérifier la session actuelle
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from('User')
            .select('*')
            .eq('id', user.id)
            .single()
          
          setAuthState({ user, profile, loading: false })
        } else {
          setAuthState({ user: null, profile: null, loading: false })
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error)
        setAuthState({ user: null, profile: null, loading: false })
      }
    }

    checkSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('User')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setAuthState({ 
            user: session.user, 
            profile, 
            loading: false 
          })
        } else {
          setAuthState({ user: null, profile: null, loading: false })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (
    email: string, 
    password: string, 
    metadata: { nom: string; prenom: string; telephone?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      router.push('/auth/login')
    }
    return { error }
  }

  const isAdmin = () => {
    return authState.profile?.role === Role.ADMIN || 
           authState.profile?.role === Role.SUPER_ADMIN
  }

  const isSuperAdmin = () => {
    return authState.profile?.role === Role.SUPER_ADMIN
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSuperAdmin,
  }
}