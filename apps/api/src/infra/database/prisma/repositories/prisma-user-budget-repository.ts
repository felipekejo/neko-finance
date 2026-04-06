import type { UserBudget } from '@/domain/entities/user-budget'
import { UserBudgetRepository } from '@/domain/repositories/user-budget-repository'
import { Injectable } from '@nestjs/common'
import { PrismaUserBudgetMapper } from '../mappers/prisma-user-budget-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserBudgetRepository implements UserBudgetRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserIdAndBudgetId(userId: string, budgetId: string) {
    const userBudget = await this.prisma.userBudget.findFirst({
      where: {
        userId,
        budgetId,
      },
    })

    if (!userBudget) {
      return null
    }

    return PrismaUserBudgetMapper.toDomain(userBudget)
  }

  async create(userBudget: UserBudget) {
    const prismaUserBudget = PrismaUserBudgetMapper.toPrisma(userBudget)

    await this.prisma.userBudget.create({
      data: prismaUserBudget,
    })
  }

  async delete(userId: string, budgetId: string) {
    await this.prisma.userBudget.deleteMany({
      where: {
        userId,
        budgetId,
      },
    })
  }
}
