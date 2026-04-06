import { GetSubcategoryByIdUseCase } from '@/domain/use-cases/get-subcategory-by-id'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { SubcategoryPresenter } from '../presenters/subcategory-presenter'

@ApiTags('Subcategories')
@Controller('/budgets/:budgetId/subcategories/:subcategoryId')
export class GetSubcategoryByIdController {
  constructor(private fetchSubcategory: GetSubcategoryByIdUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('budgetId') budgetId: string,
    @Param('subcategoryId') subcategoryId: string,
  ) {
    const result = await this.fetchSubcategory.execute({
      subcategoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const subcategory = result.value.subcategory
    return { subcategory: SubcategoryPresenter.toHTTP(subcategory) }
  }
}
