import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/entities/category'
import { Prisma, Category as PrismaCategory } from '@prisma/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
        type: raw.type,
        budgetId: new UniqueEntityID(raw.budgetId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      type: category.type,
      budgetId: category.budgetId.toString(),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }
}
