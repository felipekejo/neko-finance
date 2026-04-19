import { makeFetchAccountsUseCase } from '@/infra/factories/account.factories'
import { AccountPresenter } from '@/infra/http/presenters/account-presenter'
import type { FastifyTypedInstance } from '@/utils/fastifyTypes'
import { z } from 'zod'

const querySchema = z.object({
  budgetId: z.string(),
})

export async function fetchAccountsRoute(app: FastifyTypedInstance) {
  app.get('/accounts', {
    schema: {
      description: 'Fetch all accounts for a budget',
      tags: ['Accounts'],
      querystring: querySchema,
      response: {
        200: { description: 'Accounts list' },
        404: { description: 'No accounts found' },
      },
    },
  }, async (request, reply) => {
    const { budgetId } = request.query

    const result = await makeFetchAccountsUseCase().execute({ budgetId })

    if (result.isLeft()) {
      return reply.status(404).send({ error: 'No accounts found' })
    }

    return reply.status(200).send({
      accounts: result.value.accounts.map(AccountPresenter.toHTTP),
    })
  })
}
