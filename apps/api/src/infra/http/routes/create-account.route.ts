import { CreateAccountUseCase } from '@/domain/use-cases/create-account'
import { PrismaAccountsRepository } from '@/infra/database/prisma/repositories/prisma-accounts-repository'
import { prisma } from '@/lib/prisma'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  budgetId: z.uuid(),
  balance: z.number().default(0),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

export async function createAccountRoute(app: FastifyTypedInstance) {
  app.post<{ Body: CreateAccountBodySchema }>('/accounts', {
    schema: {
      description: 'Create a new account',
      body: createAccountBodySchema,
      tags: ['Accounts'],
      response: {
        201: {
          description: 'Account created successfully',
        },
      },
    },
  }, async (request, reply) => {
    const parseResult = createAccountBodySchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Validation error', issues: parseResult.error.issues })
    }

    const { name, budgetId, balance } = parseResult.data
    const user = request.user as { sub: string }
    const ownerId = user.sub

    const accountsRepository = new PrismaAccountsRepository(prisma)
    const createAccount = new CreateAccountUseCase(accountsRepository)

    const result = await createAccount.execute({ name, budgetId, balance, ownerId })

    if (result.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send()
  })
}
