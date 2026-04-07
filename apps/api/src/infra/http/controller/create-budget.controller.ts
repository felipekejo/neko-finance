import { AssignBudgetUseCase } from '@/domain/use-cases/assign-budget'
import { CreateBudgetUseCase } from '@/domain/use-cases/create-budget'

import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createBudgetBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createBudgetBodySchema)
type CreateBudgetBodySchema = z.infer<typeof createBudgetBodySchema>

export class CreateBudgetController {
  constructor(
    private createBudget: CreateBudgetUseCase,
    private assignBudget: AssignBudgetUseCase,
  ) { }


  async handle(
    @Body(bodyValidationPipe) body: CreateBudgetBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name } = body
    const { sub: userId } = user

    const budget = await this.createBudget.execute({
      name,
    })

    if (budget.isLeft()) {
      throw new BadRequestException()
    }
    await this.assignBudget.execute({
      budgetId: budget.value?.budget.id.toString(),
      userId,
    })
  }
}
