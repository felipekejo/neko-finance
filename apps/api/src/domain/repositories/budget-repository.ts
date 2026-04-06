import { Budget } from '../entities/budget'

export abstract class BudgetsRepository {
  abstract create(budget: Budget): Promise<void>
  abstract findById(id: string): Promise<Budget | null>
  abstract delete(budget: Budget): Promise<void>
  abstract save(budget: Budget): Promise<void>
}
