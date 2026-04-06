import { Either, left, right } from '@/core/either'
import { Transaction } from '../entities/transaction'
import { TransactionsRepository } from '../repositories/transaction-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetTransactionByIdUseCaseRequest {
  id: string
}

type GetTransactionByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    transaction: Transaction
  }
>

export class GetTransactionByIdUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    id,
  }: GetTransactionByIdUseCaseRequest): Promise<GetTransactionByIdUseCaseResponse> {
    const transaction = await this.transactionsRepository.findById(id)
    if (!transaction) {
      return left(new ResourceNotFoundError())
    }
    return right({ transaction })
  }
}
