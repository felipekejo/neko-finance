import { makeCreateAccountUseCase } from '@/infra/factories/account.factories'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string(),
  budgetId: z.uuid(),
  balance: z.number().default(0),
})

export async function createAccountRoute(app: FastifyTypedInstance) {
  app.post('/accounts', {
    schema: {
      description: 'Create a new account',
      tags: ['Accounts'],
      body: bodySchema,
      response: {
        201: { description: 'Account created successfully' },
        400: { description: 'Bad Request' },
      },
    },
  }, async (request, reply) => {
    const { name, budgetId, balance } = request.body
    const ownerId = request.user.sub

    const result = await makeCreateAccountUseCase().execute({ name, budgetId, balance, ownerId })

    if (result.isLeft()) {
      return reply.status(400).send({ error: 'Bad Request' })
    }

    return reply.status(201).send()
  })
}
