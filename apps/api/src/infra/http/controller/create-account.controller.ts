import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateAccountUseCase } from '../../../domain/use-cases/create-account'

const createAccountBodySchema = z.object({
  name: z.string(),
  balance: z.number(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

export async function createAccountRoute(
  fastify: FastifyInstance,
  createAccount: CreateAccountUseCase,
) {
  fastify.post<{
    Params: { budgetId: string }
    Body: CreateAccountBodySchema
  }>(
    '/budgets/:budgetId/accounts',
    async (request: FastifyRequest<{ Params: { budgetId: string }; Body: CreateAccountBodySchema }>, reply: FastifyReply) => {
      // Validação manual com Zod
      const parseResult = createAccountBodySchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send({ error: 'Validation error', issues: parseResult.error.issues })
      }

      const { name, balance } = parseResult.data
      const { budgetId } = request.params

      // Usuário autenticado via JWT (fastify-jwt)
      const user = request.user as { sub: string }
      const ownerId = user.sub

      const result = await createAccount.execute({
        name,
        ownerId,
        budgetId,
        balance,
      })

      if (result.isLeft()) {
        return reply.status(400).send({ error: 'Bad Request' })
      }

      return reply.status(201).send()
    },
  )
}