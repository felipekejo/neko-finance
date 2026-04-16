import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserBudget, type UserBudgetProps } from '@/domain/entities/user-budget'
import { PrismaUserBudgetMapper } from '@/infra/database/prisma/mappers/prisma-user-budget-mapper'
import type { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeUserBudget(
  override: Partial<UserBudget> = {},
  id?: UniqueEntityID,
) {
  const userBudget = UserBudget.create(
    {
      userId: new UniqueEntityID(),
      budgetId: new UniqueEntityID(),

      ...override,
    },
    id,
  )

  return userBudget
}

@Injectable()
export class UserBudgetFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUserBudget(
    data: Partial<UserBudgetProps> = {},
  ): Promise<UserBudget> {
    const userBudget = makeUserBudget(data)
    await this.prisma.userBudget.create({
      data: PrismaUserBudgetMapper.toPrisma(userBudget),
    })

    return userBudget
  }
}
