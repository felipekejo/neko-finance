import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Subcategory, SubcategoryProps } from '@/domain/entities/subcategory'
import { PrismaSubcategoryMapper } from '@/infra/database/prisma/mappers/prisma-subcategory-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeSubcategory(
  override: Partial<SubcategoryProps> = {},
  id?: UniqueEntityID,
) {
  const subcategory = Subcategory.create(
    {
      name: faker.lorem.sentence(),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return subcategory
}

@Injectable()
export class SubcategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSubcategory(
    data: Partial<SubcategoryProps> = {},
  ): Promise<Subcategory> {
    const subcategory = makeSubcategory(data)
    await this.prisma.subCategory.create({
      data: PrismaSubcategoryMapper.toPrisma(subcategory),
    })

    return subcategory
  }
}
