import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Budget, BudgetProps } from '@/domain/entities/budget'
import { PrismaBudgetMapper } from '@/infra/database/prisma/mappers/prisma-budget-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeBudget(
  override: Partial<BudgetProps> = {},
  id?: UniqueEntityID,
) {
  const budget = Budget.create(
    {
      name: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return budget
}

@Injectable()
export class BudgetFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBudget(data: Partial<BudgetProps> = {}): Promise<Budget> {
    const budget = makeBudget(data)
    await this.prisma.budget.create({
      data: PrismaBudgetMapper.toPrisma(budget),
    })

    return budget
  }
}
