import { Role } from '@/types';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';


const PUBLIC_ROUTES = ['/', '/login', '/register', '/unauthorized']
// Routes par rôle
const ROLE_ROUTES = {
  [Role.CITOYEN]: {
    allowed: ['/dashboard', '/demandes', '/calendrier', '/notifications', '/profile', '/settings'],
    home: '/dashboard'
  },
  [Role.ADMIN]: {
    allowed: ['/admin', '/profile', '/settings'],
    home: '/admin/dashboard'
  },
  [Role.SUPER_ADMIN]: {
    allowed: ['/super-admin', '/admin', '/dashboard', '/demandes', '/profile', '/settings'],
    home: '/super-admin/dashboard'
  }
}



export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname
  console.log("Path:", path);

  // Vérifier si c'est une route publique
  const isPublicRoute = PUBLIC_ROUTES.some(route => path === route || path.startsWith('/api/'))
  // Si l'utilisateur n'est pas connecté
  if (!user) {
    // Autoriser l'accès aux routes publiques
    if (isPublicRoute) {
      return supabaseResponse
    }

    // Rediriger vers la page de connexion pour les routes protégées
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est connecté, récupérer son profil et son rôle
  const { data: userData } = await supabase
    .from('User')
    .select('role, isActive')
    .eq('id', user.id)
    .single()

  if (!userData) {
    // Si le profil n'existe pas, déconnecter l'utilisateur
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Vérifier si le compte est actif
  if (!userData.isActive) {
    return NextResponse.redirect(new URL('/account-suspended', request.url))
  }

  const userRole = userData.role as Role

  // Redirection depuis les pages d'authentification vers le tableau de bord approprié
  if (path.startsWith('/auth/')) {
    return NextResponse.redirect(new URL(ROLE_ROUTES[userRole].home, request.url))
  }

  // Redirection depuis la racine vers le tableau de bord approprié
  if (path === '/') {
    return NextResponse.redirect(new URL(ROLE_ROUTES[userRole].home, request.url))
  }

  // Vérifier les permissions pour la route actuelle
  const hasPermission = checkRoutePermission(path, userRole)

  if (!hasPermission) {
    // Si l'utilisateur n'a pas la permission, le rediriger vers son tableau de bord
    return NextResponse.redirect(new URL(ROLE_ROUTES[userRole].home, request.url))
  }


  return supabaseResponse
}


function checkRoutePermission(path: string, role: Role): boolean {
  const roleConfig = ROLE_ROUTES[role]

  // Vérifier si le chemin correspond à l'une des routes autorisées
  return roleConfig.allowed.some(allowedPath =>
    path === allowedPath || path.startsWith(`${allowedPath}/`)
  )
}

