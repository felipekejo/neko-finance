import { Category } from '@/domain/entities/category'
import { CategoriesFilter, CategoriesRepository, type FindByNameProps } from '@/domain/repositories/category-repository'
import { Injectable } from '@nestjs/common'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoryRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}
  async delete(category: Category) {
    const data = PrismaCategoryMapper.toPrisma(category)
    await this.prisma.category.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(category: Category) {
    const data = PrismaCategoryMapper.toPrisma(category)
    await this.prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(category: Category) {
    const data = PrismaCategoryMapper.toPrisma(category)
    await this.prisma.category.create({
      data,
    })
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }
  async findMany(filters:CategoriesFilter,budgetId:string) {
    if (filters.type) {
      filters.type = filters.type.toUpperCase() as 'EXPENSES' | 'INCOMES'
    }
    const categories = await this.prisma.category.findMany({
      where: {
        type: filters.type,
        budgetId: budgetId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async findByName({name, budgetId}: FindByNameProps) {
    const category = await this.prisma.category.findFirst({
      where: {
        name,
        budgetId,
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }
}
