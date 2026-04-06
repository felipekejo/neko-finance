import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Budget } from '@/domain/entities/budget'
import { Prisma, Budget as PrismaBudget } from '@prisma/client'

export class PrismaBudgetMapper {
  static toDomain(raw: PrismaBudget): Budget {
    return Budget.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(budget: Budget): Prisma.BudgetUncheckedCreateInput {
    return {
      id: budget.id.toString(),
      name: budget.name,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    }
  }
}
