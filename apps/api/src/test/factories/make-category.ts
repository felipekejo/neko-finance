import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category, CategoryProps } from '@/domain/entities/category'
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
) {
  enum TypeTransaction {
    EXPENSES = 'EXPENSES',
    INCOMES = 'INCOMES',
  }

  const category = Category.create(
    {
      name: faker.lorem.sentence(),
      budgetId: new UniqueEntityID(),
      type: faker.helpers.enumValue(TypeTransaction),
      ...override,
    },
    id,
  )

  return category
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data)
    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    })

    return category
  }
}
