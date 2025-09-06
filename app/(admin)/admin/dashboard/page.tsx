// src/app/(admin)/admin/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Building2,
  Timer,
  BarChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { StatutDemande, Urgence } from '@prisma/client'

async function getAdminDashboardData(adminId: string) {
  // Récupérer les administrations gérées par cet admin
  const adminAdministrations = await prisma.adminAdministration.findMany({
    where: { userId: adminId },
    include: { administration: true }
  })

  const administrationIds = adminAdministrations.map(aa => aa.administrationId)

  if (administrationIds.length === 0) {
    return {
      demandes: [],
      stats: {
        total: 0,
        aTraiter: 0,
        traitees: 0,
        urgent: 0,
        tempsTraitementMoyen: 0
      },
      recentActivities: [],
      upcomingAudiences: []
    }
  }

  const [demandes, allDemandes, recentActivities, upcomingAudiences] = await Promise.all([
    // Demandes récentes à traiter
    prisma.demandeAudience.findMany({
      where: {
        administrationId: { in: administrationIds },
        statut: { in: [StatutDemande.SOUMISE, StatutDemande.RECUE] }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: true,
        administration: true,
        accuseReception: true
      }
    }),

    // Toutes les demandes pour les stats
    prisma.demandeAudience.findMany({
      where: { administrationId: { in: administrationIds } },
      include: { traitement: true }
    }),

    // Activités récentes
    prisma.traitement.findMany({
      where: {
        demande: { administrationId: { in: administrationIds } },
        treatedById: adminId
      },
      orderBy: { dateDecision: 'desc' },
      take: 5,
      include: {
        demande: {
          include: { user: true, administration: true }
        }
      }
    }),

    // Audiences à venir
    prisma.traitement.findMany({
      where: {
        demande: { administrationId: { in: administrationIds } },
        decision: 'ACCEPTEE',
        dateAudienceFixee: { gte: new Date() }
      },
      orderBy: { dateAudienceFixee: 'asc' },
      take: 5,
      include: {
        demande: {
          include: { user: true, administration: true }
        }
      }
    })
  ])

  // Calculer les statistiques
  const stats = {
    total: allDemandes.length,
    aTraiter: allDemandes.filter(d =>
      [StatutDemande.SOUMISE, StatutDemande.RECUE].includes(d.statut)
    ).length,
    traitees: allDemandes.filter(d =>
      [StatutDemande.ACCEPTEE, StatutDemande.REFUSEE].includes(d.statut)
    ).length,
    urgent: allDemandes.filter(d =>
      d.urgence === Urgence.ELEVEE || d.urgence === Urgence.CRITIQUE
    ).length,
    tempsTraitementMoyen: calculateAverageProcessingTime(allDemandes)
  }

  return {
    demandes,
    stats,
    recentActivities,
    upcomingAudiences,
    administrations: adminAdministrations.map(aa => aa.administration)
  }
}

function calculateAverageProcessingTime(demandes: any[]) {
  const treatedDemandes = demandes.filter(d => d.traitement)
  if (treatedDemandes.length === 0) return 0

  const totalDays = treatedDemandes.reduce((acc, d) => {
    const created = new Date(d.createdAt)
    const treated = new Date(d.traitement.dateDecision)
    const days = Math.floor((treated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return acc + days
  }, 0)

  return Math.round(totalDays / treatedDemandes.length)
}

export default async function AdminDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { demandes, stats, recentActivities, upcomingAudiences, administrations } =
    await getAdminDashboardData(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord administrateur</h1>
          <p className="text-gray-500 mt-1">
            Gérez les demandes d'audience de vos administrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {administrations.map((admin) => (
            <Badge key={admin.id} variant="secondary">
              <Building2 className="h-3 w-3 mr-1" />
              {admin.nom}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Demandes à traiter
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aTraiter}</div>
            {stats.aTraiter > 0 && (
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Action requise
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Demandes traitées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.traitees}</div>
            <Progress
              value={stats.total > 0 ? (stats.traitees / stats.total) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Demandes urgentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              Élevée ou critique
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temps de traitement
            </CardTitle>
            <Timer className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tempsTraitementMoyen}j</div>
            <p className="text-xs text-muted-foreground">
              En moyenne
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Demandes à traiter */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes en attente</CardTitle>
            <CardDescription>
              Demandes nécessitant votre attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {demandes.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">
                  Aucune demande en attente
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {demandes.map((demande) => (
                  <div
                    key={demande.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>
                          {demande.user.prenom[0]}{demande.user.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{demande.objet}</p>
                        <p className="text-sm text-gray-500">
                          {demande.user.prenom} {demande.user.nom} •
                          {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {demande.urgence !== Urgence.NORMALE && (
                        <Badge variant={
                          demande.urgence === Urgence.CRITIQUE ? 'destructive' : 'secondary'
                        }>
                          {demande.urgence}
                        </Badge>
                      )}
                      <Button size="sm" asChild>
                        <Link href={`/admin/demandes/${demande.id}`}>
                          Traiter
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audiences à venir */}
        <Card>
          <CardHeader>
            <CardTitle>Prochaines audiences</CardTitle>
            <CardDescription>
              Rendez-vous planifiés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAudiences.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  Aucune audience planifiée
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAudiences.map((audience) => (
                  <div
                    key={audience.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{audience.demande.objet}</p>
                      <p className="text-sm text-gray-500">
                        {audience.demande.user.prenom} {audience.demande.user.nom}
                      </p>
                      <div className="flex items-center text-sm text-blue-600 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(audience.dateAudienceFixee!).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/audiences/${audience.demande.id}`}>
                        Détails
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/demandes">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Toutes les demandes
                <FileText className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>
                Gérer l'ensemble des demandes
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/statistiques">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Statistiques
                <BarChart className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>
                Analyser les performances
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/audiences">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Calendrier
                <Calendar className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>
                Gérer les audiences planifiées
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}