import { PaginationParams } from '@/core/repositories/pagination-params'
import { Transaction } from '@/domain/entities/transaction'
import { CategoryAmountGroup, TransactionFilters, TransactionsRepository } from '@/domain/repositories/transaction-repository'
import { PrismaClient } from '@/generated/client'
import { PrismaTransactionsMapper } from '../mappers/prisma-transactions-mapper'

export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(private prisma: PrismaClient) { }
  async findMany(
    filters: TransactionFilters,
    { page = 1, perPage = 10 }: PaginationParams,
  ): Promise<Transaction[]> {
    const where: any = {}
    const pageNumber = Number(page) || 1
    const perPageNumber = Number(perPage) || 10

    if (filters.accountId) where.accountId = filters.accountId
    if (filters.categoryId) where.categoryId = filters.categoryId
    if (filters.budgetId) where.budgetId = filters.budgetId
    if (filters.type) where.type = filters.type

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}

      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo
      }
    }


    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (pageNumber - 1) * perPageNumber,
      take: perPageNumber,
      include: {
        Category: {
          include: {
            subcategories: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return transactions.map(PrismaTransactionsMapper.toDomain)
  }

  async create(transaction: Transaction) {
    const data = PrismaTransactionsMapper.toPrisma(transaction)

    await this.prisma.transaction.create({
      data,
    })
  }

  async delete(transaction: Transaction) {
    const data = PrismaTransactionsMapper.toPrisma(transaction)

    await this.prisma.transaction.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        Category: {
          include: {
            subcategories: {
              select: {
                name: true,
              },
            },
          },
        },
      }
    })

    if (!transaction) {
      return null
    }

    return PrismaTransactionsMapper.toDomain(transaction)
  }


  async sumAmountBy(filters: TransactionFilters): Promise<number> {
    const where: any = {}

    if (filters.accountId) where.accountId = filters.accountId
    if (filters.categoryId) where.categoryId = filters.categoryId
    if (filters.budgetId) where.budgetId = filters.budgetId
    if (filters.type) where.type = filters.type

    if (filters.dateFrom || filters.dateTo) {
      where.date = {}
      if (filters.dateFrom) where.date.gte = filters.dateFrom
      if (filters.dateTo) where.date.lte = filters.dateTo
    }

    const result = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where,
    })

    return result._sum.amount || 0
  }

  async groupAmountByCategory(filters: TransactionFilters): Promise<CategoryAmountGroup[]> {
    const where: any = {}

    if (filters.accountId) where.accountId = filters.accountId
    if (filters.categoryId) where.categoryId = filters.categoryId
    if (filters.budgetId) where.budgetId = filters.budgetId
    if (filters.type) where.type = filters.type

    if (filters.dateFrom || filters.dateTo) {
      where.date = {}
      if (filters.dateFrom) where.date.gte = filters.dateFrom
      if (filters.dateTo) where.date.lte = filters.dateTo
    }

    const groups = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      _sum: { amount: true },
      where,
    })

    return groups.map((g) => ({
      categoryId: g.categoryId,
      total: g._sum.amount ?? 0,
    }))
  }

  async save(transaction: Transaction) {
    const data = PrismaTransactionsMapper.toPrisma(transaction)
    await this.prisma.transaction.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
