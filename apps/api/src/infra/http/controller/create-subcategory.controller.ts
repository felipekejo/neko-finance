import { CreateCategoryUseCase } from '@/domain/use-cases/create-category'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateSubcategoryUseCase } from '@/domain/use-cases/create-subcategory'

const createSubcategoryBodySchema = z.object({
  name: z.string(),
  categoryId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createSubcategoryBodySchema)
type CreateSubcategoryBodySchema = z.infer<typeof createSubcategoryBodySchema>

@ApiTags('Subcategories')
@Controller('/subcategories')
export class CreateSubcategoryController {
  constructor(private createSubcategory: CreateSubcategoryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateSubcategoryBodySchema,
  ) {
    const { name, categoryId } = body
    const result = await this.createSubcategory.execute({
      name,
      categoryId
    })
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
