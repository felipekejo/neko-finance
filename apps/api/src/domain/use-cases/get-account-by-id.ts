import { Either, left, right } from '@/core/either'
import { Account } from '../entities/account'
import { AccountsRepository } from '../repositories/account-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetAccountByIdUseCaseRequest {
  id: string
}

type GetAccountByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    account: Account
  }
>

export class GetAccountByIdUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({
    id,
  }: GetAccountByIdUseCaseRequest): Promise<GetAccountByIdUseCaseResponse> {
    const account = await this.accountsRepository.findById(id)
    if (!account) {
      return left(new ResourceNotFoundError())
    }
    return right({ account })
  }
}
