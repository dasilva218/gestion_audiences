// src/types/index.ts
import {
  AccuseReception,
  Administration,
  DemandeAudience,
  Document,
  Role,
  StatutDemande,
  Traitement,
  Urgence,
  User
} from '@/generated/prisma'

export type {
  AccuseReception, Administration,
  DemandeAudience, Document, Traitement, User
}

export { Role, StatutDemande, Urgence }

// Types personnalisés
export interface DemandeWithRelations extends DemandeAudience {
  user: User
  administration: Administration
  accuseReception?: AccuseReception | null
  traitement?: Traitement | null
  documents: Document[]
}

export interface AdminWithAdministrations extends User {
  adminAdministrations: {
    administration: Administration
  }[]
}