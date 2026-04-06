
import { FetchCategoriesUseCase } from "@/domain/use-cases/fetch-categories";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoryPresenter } from "../presenters/category-presenter";

@ApiTags('Categories')
@Controller('/budgets/:budgetId/categories')
export class FetchCategoriesController{
  constructor(private fetchCategories:FetchCategoriesUseCase){}

  @Get()
  async handle(
    @CurrentUser() user:UserPayload,
    @Param('budgetId') budgetId:string
  ){
    const result = await this.fetchCategories.execute({
      budgetId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const categories = result.value.categories

    return {categories: categories.map(CategoryPresenter.toHTTP)}
  }
}