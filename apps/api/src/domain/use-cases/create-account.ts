import { Either, right } from '@/core/either'
import { Account } from '../entities/account'
import { AccountService } from '../service/account.service'


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
  constructor(private accountService: AccountService) {}

  async execute({
    name,
    ownerId,
    budgetId,
    balance,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const result = await this.accountService.createAccount({
      name,
      ownerId,
      budgetId,
      balance,
    })
    if (result.isLeft()) {
      return result
    }

    return right({ account:  result.value.account })
  }
}
