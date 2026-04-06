import { FetchSubcategoriesUseCase } from "@/domain/use-cases/fetch-subcategories";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SubcategoryPresenter } from "../presenters/subcategory-presenter";

@ApiTags('Subcategories')
@Controller('/subcategories/:categoryId')
export class FetchSubcategoriesController{
  constructor(private fetchSubcategories:FetchSubcategoriesUseCase){}

  @Get()
  async handle(
    @Param('categoryId') categoryId:string
  ){
    const result = await this.fetchSubcategories.execute({
      categoryId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const subcategories = result.value.subcategories

    return {subcategories: subcategories.map(SubcategoryPresenter.toHTTP)}
  }
}