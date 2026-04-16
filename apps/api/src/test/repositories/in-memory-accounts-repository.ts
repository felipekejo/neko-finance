import { Account } from '@/domain/entities/account'
import { AccountsRepository, type FindByNameProps } from '@/domain/repositories/account-repository'

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = []

  async findById(id: string) {
    const account = this.items.find((item) => item.id.toString() === id)

    if (!account) {
      return null
    }

    return account
  }

  async create(account: Account) {
    this.items.push(account)
  }

  async delete(account: Account): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === account.id)

    this.items.splice(itemIndex, 1)
  }

  async save(account: Account): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === account.id)

    this.items[itemIndex] = account
  }
  
  async findMany(budgetId:string): Promise<Account[]> {
    const accounts = this.items.filter((item) => item.budgetId.toString() === budgetId)
    return accounts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async findByName({ name, budgetId }: FindByNameProps): Promise<Account | null> {
    const account = this.items.find(
      (item) => item.name === name && item.budgetId.toString() === budgetId
    )
    if (!account) {
      return null
    }
    return account
  }
}
