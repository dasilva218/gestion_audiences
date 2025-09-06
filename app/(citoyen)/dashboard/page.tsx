// src/app/(citoyen)/dashboard/page.tsx
// import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
// import { prisma } from '@/lib/prisma/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import prisma from '@/lib/prisma/client'
// import StatutDemande from '@prisma/client'
import { createClient } from '@/lib/supabase/client'
import { StatutDemande } from '@/types'
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

async function getDashboardData(userId: string) {
  const [demandes, stats] = await Promise.all([
    // Récupérer les 5 dernières demandes
    prisma.demandeAudience.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        administration: true,
        accuseReception: true,
        traitement: true
      }
    }),
    // Récupérer les statistiques
    prisma.demandeAudience.groupBy({
      by: ['statut'],
      where: { userId },
      _count: true
    })
  ])

  // Calculer les statistiques
  const totalDemandes = stats.reduce((acc, s) => acc + s._count, 0)
  const statsMap = stats.reduce((acc, s) => {
    acc[s.statut] = s._count
    return acc
  }, {} as Record<string, number>)

  return {
    demandes,
    stats: {
      total: totalDemandes,
      enCours: (statsMap[StatutDemande.SOUMISE] || 0) + (statsMap[StatutDemande.EN_TRAITEMENT] || 0),
      acceptees: statsMap[StatutDemande.ACCEPTEE] || 0,
      refusees: statsMap[StatutDemande.REFUSEE] || 0,
    }
  }
}

export default async function CitoyenDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { demandes, stats } = await getDashboardData(user.id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Gérez vos demandes d'audience et suivez leur avancement
          </p>
        </div>
        <Button asChild>
          <Link href="/demandes/nouvelle">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total demandes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Depuis votre inscription
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En cours
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enCours}</div>
            <Progress value={(stats.enCours / stats.total) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Acceptées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acceptees}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Taux d'acceptation: {stats.total > 0 ? Math.round((stats.acceptees / stats.total) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Refusées
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.refusees}</div>
            <p className="text-xs text-muted-foreground">
              Demandes non acceptées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes récentes</CardTitle>
          <CardDescription>
            Vos 5 dernières demandes d'audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demandes.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore de demande d'audience
              </p>
              <Button asChild>
                <Link href="/demandes/nouvelle">
                  Créer ma première demande
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {demandes.map((demande) => (
                <div
                  key={demande.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{demande.objet}</h3>
                      <Badge variant={getStatusVariant(demande.statut)}>
                        {getStatusLabel(demande.statut)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {demande.administration.nom} • {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {demande.traitement?.dateAudienceFixee && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(demande.traitement.dateAudienceFixee).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/demandes/${demande.id}`}>
                        Voir détails
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/demandes">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Toutes mes demandes
                <FileText className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>
                Consultez l'historique complet de vos demandes
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/calendrier">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Mon calendrier
                <Calendar className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>
                Gérez vos rendez-vous et audiences planifiées
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}

// Helper functions
function getStatusVariant(status: StatutDemande) {
  switch (status) {
    case StatutDemande.ACCEPTEE:
      return 'default' // green
    case StatutDemande.REFUSEE:
      return 'destructive'
    case StatutDemande.EN_TRAITEMENT:
      return 'secondary'
    case StatutDemande.SOUMISE:
    case StatutDemande.RECUE:
      return 'outline'
    default:
      return 'outline'
  }
}

function getStatusLabel(status: StatutDemande) {
  switch (status) {
    case StatutDemande.BROUILLON:
      return 'Brouillon'
    case StatutDemande.SOUMISE:
      return 'Soumise'
    case StatutDemande.RECUE:
      return 'Reçue'
    case StatutDemande.EN_TRAITEMENT:
      return 'En traitement'
    case StatutDemande.ACCEPTEE:
      return 'Acceptée'
    case StatutDemande.REFUSEE:
      return 'Refusée'
    case StatutDemande.ANNULEE:
      return 'Annulée'
    default:
      return status
  }
}