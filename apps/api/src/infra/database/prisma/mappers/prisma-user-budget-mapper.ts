import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserBudget } from '@/domain/entities/user-budget'
import { Prisma, UserBudget as PrismaUserBudget } from '@prisma/client'

export class PrismaUserBudgetMapper {
  static toDomain(raw: PrismaUserBudget): UserBudget {
    return UserBudget.create({
      budgetId: new UniqueEntityID(raw.budgetId),
      userId: new UniqueEntityID(raw.userId),
    })
  }

  static toPrisma(user: UserBudget): Prisma.UserBudgetUncheckedCreateInput {
    return {
      budgetId: user.budgetId.toString(),
      userId: user.userId.toString(),
    }
  }
}
