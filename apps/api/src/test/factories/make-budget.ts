import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Budget, BudgetProps } from '@/domain/entities/budget'
import { faker } from '@faker-js/faker'

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
