import { Account } from '../entities/account';

export interface FindByNameProps {
  name: string
  budgetId: string
}

export interface UpdateAmountProps {
  accountId: string
  amount: number
  type: 'INCOMES' | 'EXPENSES'
}

export abstract class AccountsRepository {
  abstract create(account: Account): Promise<void>
  abstract findById(id: string): Promise<Account | null>
  abstract delete(account: Account): Promise<void>
  abstract save(account: Account): Promise<void>
  abstract findMany(budgetId:string): Promise<Account[]>
  abstract findByName({name, budgetId}: FindByNameProps): Promise<Account | null>
}
