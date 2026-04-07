import { Subcategory } from '@/domain/entities/subcategory'
import { SubcategoriesRepository } from '@/domain/repositories/subcategory-repository'
import { PrismaClient } from '@/generated/client'
import { PrismaSubcategoryMapper } from '../mappers/prisma-subcategory-mapper'

export class PrismaSubcategoriesRepository implements SubcategoriesRepository {
  constructor(private prisma: PrismaClient) { }
  async delete(subcategory: Subcategory) {
    const data = PrismaSubcategoryMapper.toPrisma(subcategory)

    await this.prisma.subCategory.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(subcategory: Subcategory) {
    const data = PrismaSubcategoryMapper.toPrisma(subcategory)
    await this.prisma.subCategory.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findById(id: string) {
    const subcategory = await this.prisma.subCategory.findUnique({
      where: {
        id,
      },
    })

    if (!subcategory) {
      return null
    }

    return PrismaSubcategoryMapper.toDomain(subcategory)
  }

  async create(subcategory: Subcategory) {
    const data = PrismaSubcategoryMapper.toPrisma(subcategory)

    await this.prisma.subCategory.create({
      data,
    })
  }

  async findMany(categoryId: string) {
    const data = await this.prisma.subCategory.findMany({
      where: {
        categoryId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return data.map(PrismaSubcategoryMapper.toDomain)
  }

  async findByName(name: string) {
    const category = await this.prisma.subCategory.findFirst({
      where: {
        name,
      },
    })

    if (!category) {
      return null
    }

    return PrismaSubcategoryMapper.toDomain(category)
  }
}
