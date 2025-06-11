// prisma/seed.ts
// import {  Role } from '@/generated/prisma'
import { Role } from '@/types'
import prisma from './client'

// const prisma = new PrismaClient()

async function main() {
  // Créer un super admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@platform.gov',
      nom: 'Admin',
      prenom: 'Super',
      role: Role.SUPER_ADMIN,
    },
  })

  // Créer une administration test
  const administration = await prisma.administration.create({
    data: {
      nom: 'Ministère de l\'Intérieur',
      description: 'Administration centrale',
      adresse: '1 Place Beauvau, 75008 Paris',
      email: 'contact@interieur.gov',
      telephone: '0140076060',
      createdById: superAdmin.id,
    },
  })

  console.log({ superAdmin, administration })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })