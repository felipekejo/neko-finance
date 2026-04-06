import type { Account } from '@/domain/entities/account'

export class AccountPresenter {
  static toHTTP(account: Account) {
    return {
      id: account.id.toString(),
      name: account.name,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      budgetId: account.budgetId.toString(),
      balance: account.balance,
      ownerId: account.ownerId.toString(),
    }
  }
}
