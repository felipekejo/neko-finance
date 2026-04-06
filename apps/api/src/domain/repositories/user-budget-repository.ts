import { UserBudget } from '../entities/user-budget'

export abstract class UserBudgetRepository {
  abstract findByUserIdAndBudgetId(
    userId: string,
    budgetId: string,
  ): Promise<UserBudget | null>

  abstract create(userBudget: UserBudget): Promise<void>
  abstract delete(userId: string, budgetId: string): Promise<void>
}
