import { Either, left, right } from '@/core/either'
import { AccountsRepository } from '../repositories/account-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface DeleteAccountUseCaseRequest {
  accountId: string
  ownerId: string
}

type DeleteAccountUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {}
>

export class DeleteAccountUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    accountId,
    ownerId,
  }: DeleteAccountUseCaseRequest): Promise<DeleteAccountUseCaseResponse> {
    const account = await this.accountsRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError())
    }

    if (account.ownerId.toString() !== ownerId) {
      return left(new UnauthorizedError())
    }

    await this.accountsRepository.delete(account)
    return right({})
  }
}
