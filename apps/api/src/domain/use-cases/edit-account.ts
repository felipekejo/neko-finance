import { Either, left, right } from '@/core/either'
import { AccountsRepository } from '../repositories/account-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface EditAccountUseCaseRequest {
  accountId: string
  ownerId: string
  name: string
  balance: number
}

type EditAccountUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class EditAccountUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    accountId,
    ownerId,
    name,
    balance,
  }: EditAccountUseCaseRequest): Promise<EditAccountUseCaseResponse> {
    const account = await this.accountsRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError())
    }

    if (account.ownerId.toString() !== ownerId) {
      return left(new UnauthorizedError())
    }

    account.name = name
    account.balance = balance

    await this.accountsRepository.save(account)
    return right({})
  }
}
