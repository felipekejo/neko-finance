import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Account } from '../entities/account'
import type { AccountsRepository } from '../repositories/account-repository'

interface CreateAccountUseCaseRequest {
  ownerId: string
  budgetId: string
  name: string
  balance: number
}

type CreateAccountUseCaseResponse = Either<
  null,
  {
    account: Account
  }
>

export class CreateAccountUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    name,
    ownerId,
    budgetId,
    balance,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
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
