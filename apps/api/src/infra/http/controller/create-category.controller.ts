import { CreateCategoryUseCase } from '@/domain/use-cases/create-category'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createCategoryBodySchema = z.object({
  name: z.string(),
  type: z.enum(['INCOMES', 'EXPENSES']),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@ApiTags('Categories')
@Controller('/budgets/:budgetId/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @Param('budgetId') budgetId: string,
  ) {
    const { name, type } = body
    const result = await this.createCategory.execute({
      name,
      type,
      budgetId,
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
