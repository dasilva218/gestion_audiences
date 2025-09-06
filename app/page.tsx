// src/app/page.tsx
"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  MessageSquare,
  Shield,
  Star,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// import { Navbar } from '@/components/shared/navbar'
import { Navbar } from '@/components/shared/navbar'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-70 animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 px-4 py-1" variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              Plateforme officielle de l'administration
            </Badge>

            <h1 className={cn(
              "text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent",
              mounted && "animate-in fade-in-0 slide-in-from-bottom-4 duration-700"
            )}>
              Demandez votre audience en ligne
            </h1>

            <p className={cn(
              "text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed",
              mounted && "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200"
            )}>
              Simplifiez vos démarches administratives. Soumettez vos demandes d'audience
              auprès de n'importe quelle administration publique en quelques clics.
            </p>

            <div className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center",
              mounted && "animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500"
            )}>
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/register">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="#fonctionnalites">
                  Découvrir la plateforme
                </Link>
              </Button>
            </div>

            {/* Stats preview */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">15k+</div>
                <div className="text-sm text-gray-600">Demandes traitées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">48h</div>
                <div className="text-sm text-gray-600">Temps de réponse</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Fonctionnalités</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour gérer vos demandes d'audience de A à Z
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={cn(
                  "group hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                  mounted && "animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-forwards",
                  mounted && `delay-${index * 100}`
                )}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processus" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Processus</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple en 4 étapes pour obtenir votre audience
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gray-300"></div>
                )}
                <div className="flex items-start gap-6 mb-12">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-white border-4 border-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-blue-600">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-grow pt-2">
                    <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/register">
                Commencer ma demande
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistiques" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Impact</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Des résultats qui parlent
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme transforme la relation entre citoyens et administrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50",
                  mounted && "animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-forwards",
                  mounted && `delay-${index * 100}`
                )}
              >
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Témoignages</Badge>
            <h2 className="text-4xl font-bold mb-4">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à simplifier vos démarches ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de citoyens qui utilisent déjà notre plateforme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Créer mon compte gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
              <Link href="#contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="font-bold text-xl text-white">GovAudience</span>
              </div>
              <p className="text-sm">
                La plateforme officielle pour vos demandes d'audience administratives.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">À propos</Link></li>
                <li><Link href="#" className="hover:text-white">Comment ça marche</Link></li>
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Mentions légales</Link></li>
                <li><Link href="#" className="hover:text-white">Politique de confidentialité</Link></li>
                <li><Link href="#" className="hover:text-white">CGU</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Espace réservé</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/admin/dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    Espace Admin
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/super-admin/dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    Espace Super Admin
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 GovAudience. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Data
const features = [
  {
    icon: FileText,
    title: "Formulaire simplifié",
    description: "Remplissez votre demande en quelques minutes avec notre formulaire intuitif et guidé."
  },
  {
    icon: Clock,
    title: "Suivi en temps réel",
    description: "Suivez l'avancement de votre demande et recevez des notifications à chaque étape."
  },
  {
    icon: CheckCircle,
    title: "Accusé de réception",
    description: "Recevez instantanément un accusé de réception officiel pour chaque demande."
  },
  {
    icon: Calendar,
    title: "Gestion des rendez-vous",
    description: "Planifiez et gérez facilement vos audiences acceptées depuis votre espace."
  },
  {
    icon: MessageSquare,
    title: "Communication directe",
    description: "Échangez avec l'administration concernée directement via la plateforme."
  },
  {
    icon: BarChart3,
    title: "Tableau de bord",
    description: "Visualisez toutes vos demandes et leur statut dans un tableau de bord clair."
  }
]

const steps = [
  {
    title: "Créez votre compte",
    description: "Inscrivez-vous en quelques secondes avec votre email et vos informations personnelles."
  },
  {
    title: "Soumettez votre demande",
    description: "Remplissez le formulaire en ligne en précisant l'administration concernée et l'objet de votre demande."
  },
  {
    title: "Recevez l'accusé de réception",
    description: "Un accusé de réception vous est automatiquement envoyé avec un numéro de suivi unique."
  },
  {
    title: "Obtenez votre réponse",
    description: "L'administration traite votre demande et vous informe de sa décision avec la date d'audience si acceptée."
  }
]

const stats = [
  {
    icon: Users,
    value: "15,000+",
    label: "Utilisateurs actifs"
  },
  {
    icon: Building2,
    value: "127",
    label: "Administrations"
  },
  {
    icon: Clock,
    value: "48h",
    label: "Temps de réponse moyen"
  },
  {
    icon: CheckCircle,
    value: "98%",
    label: "Taux de satisfaction"
  }
]

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Citoyenne",
    content: "J'ai pu obtenir un rendez-vous avec le maire en seulement 3 jours. Le processus était simple et transparent."
  },
  {
    name: "Jean Martin",
    role: "Entrepreneur",
    content: "Cette plateforme a révolutionné mes démarches administratives. Plus besoin de se déplacer pour rien !"
  },
  {
    name: "Sophie Bernard",
    role: "Présidente d'association",
    content: "Le suivi en temps réel est un vrai plus. On sait exactement où en est notre demande."
  }
]