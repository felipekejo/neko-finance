import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserBudget, type UserBudgetProps } from '@/domain/entities/user-budget'

export function makeUserBudget(
  override: Partial<UserBudgetProps> = {},
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
