// src/hooks/useAuth.ts
import { supabaseClient } from '@/lib/supabase/client'
import { Role, User } from '@/types'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'


interface AuthState {
  user: SupabaseUser | null
  profile: User | null
  loading: boolean
}

// Routes par défaut selon le rôle
const DEFAULT_ROUTES = {
  [Role.CITOYEN]: '/dashboard',
  [Role.ADMIN]: '/admin/dashboard',
  [Role.SUPER_ADMIN]: '/super-admin/dashboard',
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })
  const router = useRouter()
  const searchParams = useSearchParams()


  useEffect(() => {
    // Vérifier la session actuelle
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser()

        if (user) {
          const { data: profile } = await supabaseClient
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
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabaseClient
            .from('User')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setAuthState({ 
            user: session.user, 
            profile, 
            loading: false 
          })

          // Redirection après connexion
          if (event === 'SIGNED_IN' && profile) {
            const redirectTo = searchParams.get('redirectTo')
            console.log(redirectTo);
            const defaultRoute = DEFAULT_ROUTES[profile.role as Role]
            router.push(redirectTo || defaultRoute)
          }
        } else {
          setAuthState({ user: null, profile: null, loading: false })
          
          // Redirection après déconnexion
          if (event === 'SIGNED_OUT') {
            router.push('/auth/login')
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabaseClient, router, searchParams])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error && data.user) {
      // La redirection sera gérée par onAuthStateChange
      router.refresh()
    }
    
    return { data, error }
  }

  const signUp = async (
    email: string, 
    password: string, 
    metadata: { nom: string; prenom: string; telephone?: string }
  ) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    // La redirection sera gérée par onAuthStateChange
    return { error }
  }

  const getDefaultRoute = () => {
    if (!authState.profile) return '/auth/login'
    return DEFAULT_ROUTES[authState.profile.role as Role]
  }

  const isAdmin = () => {
    return authState.profile?.role === Role.ADMIN || 
           authState.profile?.role === Role.SUPER_ADMIN
  }

  const isSuperAdmin = () => {
    return authState.profile?.role === Role.SUPER_ADMIN
  }

  const hasRole = (role: Role) => {
    return authState.profile?.role === role
  }

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isSuperAdmin,
    hasRole,
    getDefaultRoute,
  }
}