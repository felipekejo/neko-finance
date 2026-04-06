import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Subcategory } from '@/domain/entities/subcategory'
import { Prisma, SubCategory as PrismaSubcategory } from '@prisma/client'

export class PrismaSubcategoryMapper {
  static toDomain(raw: PrismaSubcategory): Subcategory {
    return Subcategory.create(
      {
        name: raw.name,
        categoryId: new UniqueEntityID(raw.categoryId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    subcategory: Subcategory,
  ): Prisma.SubCategoryUncheckedCreateInput {
    return {
      id: subcategory.id.toString(),
      name: subcategory.name,
      categoryId: subcategory.categoryId.toString(),
      createdAt: subcategory.createdAt,
      updatedAt: subcategory.updatedAt,
    }
  }
}
