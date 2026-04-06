import { EditTransactionUseCase } from '@/domain/use-cases/edit-transaction'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editTransactionBodySchema = z
  .object({
    description: z.string(),
    amount: z.number(),
    type: z.enum(['INCOMES', 'EXPENSES']),
    date: z.coerce.date(),
    categoryId: z.string(),
  })
  .partial()
  .extend({
    accountId: z.string(),
  })

const bodyValidationPipe = new ZodValidationPipe(editTransactionBodySchema)
type EditTransactionBodySchema = z.infer<typeof editTransactionBodySchema>

@ApiTags('Transactions')
@Controller('/budgets/:budgetId/transactions/:id')
export class EditTransactionController {
  constructor(private editTransaction: EditTransactionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditTransactionBodySchema,
    @Param('id') transactionId : string,
    @CurrentUser() user: UserPayload,
  ) {
    const { description, accountId, amount, date, type, categoryId } =
      body
    const { sub: ownerId } = user

    const result = await this.editTransaction.execute({
      transactionId,
      description,
      ownerId,
      type,
      amount,
      accountId,
      date,
      categoryId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
