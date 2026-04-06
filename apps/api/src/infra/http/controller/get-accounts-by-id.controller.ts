import { GetAccountByIdUseCase } from "@/domain/use-cases/get-account-by-id";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { AccountPresenter } from "../presenters/account-presenter";

@Controller('/budgets/:budgetId/accounts/:accountId')
export class GetAccountByIdController {
  constructor(private getAccountById: GetAccountByIdUseCase){}

  @Get()
  async handle(
    @Param('budgetId') budgetId: string,
    @Param('accountId') accountId: string,
  ){
    const result = await this.getAccountById.execute({
      id: accountId
    })

    if(result.isLeft()){
      throw new BadRequestException()
    }

    const account = result.value.account

    return {account : AccountPresenter.toHTTP(account)}
  }
}