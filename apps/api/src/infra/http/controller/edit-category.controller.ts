import { EditCategoryUseCase } from '@/domain/use-cases/edit-category'
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

const editCategoryBodySchema = z
  .object({
    name: z.string(),
    type: z.enum(['INCOMES', 'EXPENSES']),
  })


const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)
type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>

@ApiTags('Categories')
@Controller('/budgets/:budgetId/categories/:id')
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @Param('id') categoryId: string,
    @Param('budgetId') budgetId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, type } = body
    const { sub: ownerId } = user

    const result = await this.editCategory.execute({
      categoryId,
      name,
      type,
      budgetId
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
