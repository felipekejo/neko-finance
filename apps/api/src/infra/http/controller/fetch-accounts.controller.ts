import { FetchAccountsUseCase } from '@/domain/use-cases/fetch-accounts'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/infra/auth/current-user-decorator'
import { UserPayload } from 'src/infra/auth/jwt.strategy'
import { AccountPresenter } from '../presenters/account-presenter'

@ApiTags('Accounts')
@Controller('/budgets/:budgetId/accounts')
export class FetchAccountsController {
  constructor(private fetchAccounts:FetchAccountsUseCase ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('budgetId') budgetId: string,
  ) {
    const result = await this.fetchAccounts.execute({
      budgetId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const accounts = result.value.accounts
    return { accounts: accounts.map(AccountPresenter.toHTTP) }
  }
}
