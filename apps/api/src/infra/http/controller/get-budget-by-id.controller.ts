import { GetBudgetByIdUseCase } from '@/domain/use-cases/get-budget-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { BudgetPresenter } from '../presenters/budget-presenter'

@ApiTags('Budgets')
@Controller('/budgets/:budgetId')
export class GetBudgetByIdController {
  constructor(private fetchBudget: GetBudgetByIdUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('budgetId') budgetId: string,
  ) {
    const result = await this.fetchBudget.execute({
      budgetId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const budget = result.value.budget
    return { budget: BudgetPresenter.toHTTP(budget) }
  }
}
