import { Either, left, right } from '@/core/either'
import { Account } from '../entities/account'
import { AccountsRepository } from '../repositories/account-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface GetAccountByIdUseCaseRequest {
  id: string
  userId: string
}

type GetAccountByIdUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    account: Account
  }
>

export class GetAccountByIdUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    id,
    userId,
  }: GetAccountByIdUseCaseRequest): Promise<GetAccountByIdUseCaseResponse> {
    const account = await this.accountsRepository.findById(id)
    if (!account) {
      return left(new ResourceNotFoundError())
    }
    if (account.ownerId.toString() !== userId) {
      return left(new UnauthorizedError())
    }
    return right({ account })
  }
}
