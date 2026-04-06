import { EditSubcategoryUseCase } from '@/domain/use-cases/edit-subcategory'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editSubcategoryBodySchema = z
  .object({
    name: z.string(),
    categoryId: z.string(),
  })


const bodyValidationPipe = new ZodValidationPipe(editSubcategoryBodySchema)
type EditSubcategoryBodySchema = z.infer<typeof editSubcategoryBodySchema>

@ApiTags('Subcategories')
@Controller('/budgets/:budgetId/subcategories/:id')
export class EditSubcategoryController {
  constructor(private editSubcategory: EditSubcategoryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditSubcategoryBodySchema,
    @Param('id') subcategoryId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, categoryId } = body
    const { sub: ownerId } = user

    const result = await this.editSubcategory.execute({
      subcategoryId,
      name,
      categoryId
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
