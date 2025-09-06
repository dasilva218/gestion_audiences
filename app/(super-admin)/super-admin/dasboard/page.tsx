// src/app/(super-admin)/super-admin/dashboard/page.tsx
import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { prisma } from '@/lib/prisma/client'
import {
  Users,
  Building2,
  FileText,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Shield,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import prisma from '@/lib/prisma/client'
import { Role, StatutDemande } from '@/types'
import { supabaseClient } from '@/lib/supabase/client'
// import { Role, StatutDemande } from '@prisma/client'

async function getSuperAdminDashboardData() {
  const [
    userStats,
    administrationStats,
    demandeStats,
    recentActivities,
    systemHealth,
    topAdministrations
  ] = await Promise.all([
    // Statistiques utilisateurs
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
      where: { isActive: true }
    }),

    // Statistiques administrations
    prisma.administration.aggregate({
      _count: { _all: true },
      where: { isActive: true }
    }),

    // Statistiques demandes
    prisma.demandeAudience.groupBy({
      by: ['statut'],
      _count: true
    }),

    // Activités récentes
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: true }
    }),

    // Santé du système
    getSystemHealth(),

    // Top administrations par nombre de demandes
    prisma.demandeAudience.groupBy({
      by: ['administrationId'],
      _count: true,
      orderBy: { _count: { administrationId: 'desc' } },
      take: 5
    })
  ])

  // Récupérer les détails des top administrations
  const topAdminDetails = await prisma.administration.findMany({
    where: { id: { in: topAdministrations.map(a => a.administrationId) } }
  })

  // Formater les données
  const formattedUserStats = userStats.reduce((acc, stat) => {
    acc[stat.role] = stat._count
    return acc
  }, {} as Record<Role, number>)

  const formattedDemandeStats = demandeStats.reduce((acc, stat) => {
    acc[stat.statut] = stat._count
    return acc
  }, {} as Record<StatutDemande, number>)

  const totalDemandes = demandeStats.reduce((acc, stat) => acc + stat._count, 0)

  return {
    users: {
      total: Object.values(formattedUserStats).reduce((a, b) => a + b, 0),
      citoyens: formattedUserStats[Role.CITOYEN] || 0,
      admins: formattedUserStats[Role.ADMIN] || 0,
      superAdmins: formattedUserStats[Role.SUPER_ADMIN] || 0
    },
    administrations: {
      total: administrationStats._count._all
    },
    demandes: {
      total: totalDemandes,
      enCours: (formattedDemandeStats[StatutDemande.SOUMISE] || 0) +
        (formattedDemandeStats[StatutDemande.EN_TRAITEMENT] || 0),
      traitees: (formattedDemandeStats[StatutDemande.ACCEPTEE] || 0) +
        (formattedDemandeStats[StatutDemande.REFUSEE] || 0),
      tauxAcceptation: totalDemandes > 0
        ? Math.round(((formattedDemandeStats[StatutDemande.ACCEPTEE] || 0) / totalDemandes) * 100)
        : 0
    },
    recentActivities,
    systemHealth,
    topAdministrations: topAdministrations.map(ta => {
      const admin = topAdminDetails.find(a => a.id === ta.administrationId)
      return {
        administration: admin!,
        count: ta._count
      }
    })
  }
}

async function getSystemHealth() {
  // Simuler des métriques de santé système
  return {
    uptime: 99.9,
    responseTime: 245, // ms
    errorRate: 0.2, // %
    activeUsers: Math.floor(Math.random() * 100) + 50
  }
}

export default async function SuperAdminDashboard() {
 
  const { data: { user } } = await supabaseClient.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const data = await getSuperAdminDashboardData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
          <p className="text-gray-500 mt-1">
            Supervision complète de la plateforme GovAudience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
          <Button variant="outline" asChild>
            <Link href="/super-admin/parametres">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {data.systemHealth.errorRate > 1 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Alerte système</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              Le taux d'erreur est élevé ({data.systemHealth.errorRate}%).
              Vérifiez les logs pour plus d'informations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.users.total}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <span className="text-green-600 flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                {data.systemHealth.activeUsers} en ligne
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administrations
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.administrations.total}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Services publics actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total demandes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.demandes.total}</div>
            <div className="flex items-center text-xs mt-2">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              <span className="text-green-600">{data.demandes.tauxAcceptation}% acceptées</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Performance
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.systemHealth.uptime}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Temps de réponse: {data.systemHealth.responseTime}ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des utilisateurs</CardTitle>
            <CardDescription>Par type de compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Citoyens</span>
                <span className="text-sm text-gray-500">{data.users.citoyens}</span>
              </div>
              <Progress value={(data.users.citoyens / data.users.total) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Administrateurs</span>
                <span className="text-sm text-gray-500">{data.users.admins}</span>
              </div>
              <Progress value={(data.users.admins / data.users.total) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Super Admins</span>
                <span className="text-sm text-gray-500">{data.users.superAdmins}</span>
              </div>
              <Progress value={(data.users.superAdmins / data.users.total) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Top Administrations */}
        <Card>
          <CardHeader>
            <CardTitle>Top administrations</CardTitle>
            <CardDescription>Par nombre de demandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topAdministrations.map((item, index) => (
                <div key={item.administration.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                    <span className="text-sm font-medium truncate max-w-[150px]">
                      {item.administration.nom}
                    </span>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>
                      {activity.user.prenom[0]}{activity.user.nom[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.user.prenom} {activity.user.nom}
                      </span>
                      <span className="text-gray-500"> {activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/super-admin/administrations/nouvelle">
            <CardHeader className="text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-base">Nouvelle administration</CardTitle>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/super-admin/utilisateurs">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-base">Gérer les utilisateurs</CardTitle>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/super-admin/statistiques">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-base">Statistiques détaillées</CardTitle>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/super-admin/activites">
            <CardHeader className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <CardTitle className="text-base">Journal complet</CardTitle>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}