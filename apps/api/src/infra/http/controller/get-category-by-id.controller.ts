import { GetCategoryByIdUseCase } from '@/domain/use-cases/get-category-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { CategoryPresenter } from '../presenters/category-presenter'

@ApiTags('Categories')
@Controller('/budgets/:budgetId/categories/:categoryId')
export class GetCategoryByIdController {
  constructor(private fetchCategory: GetCategoryByIdUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('budgetId') budgetId: string,
    @Param('categoryId') categoryId: string,
  ) {
    const result = await this.fetchCategory.execute({
      budgetId,
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const category = result.value.category
    return { category: CategoryPresenter.toHTTP(category) }
  }
}
