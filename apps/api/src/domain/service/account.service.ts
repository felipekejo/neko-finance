import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Account } from '../entities/account'
import { AccountsRepository } from '../repositories/account-repository'

interface CreateAccountServiceRequest {
  ownerId: string
  budgetId: string
  name: string
  balance: number
}

type CreateAccountServiceResponse = Either<
  null,
  {
    account: Account
  }
>

export class AccountService {
  constructor(private accountsRepository: AccountsRepository) {}

  async createAccount({
    name,
    ownerId,
    budgetId,
    balance,
  }: CreateAccountServiceRequest): Promise<CreateAccountServiceResponse> {
    const account = Account.create({
      name,
      ownerId: new UniqueEntityID(ownerId),
      budgetId: new UniqueEntityID(budgetId),
      balance,
    })
    await this.accountsRepository.create(account)
    return right({ account })
  }
}
