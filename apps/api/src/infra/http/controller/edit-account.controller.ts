import { EditAccountUseCase } from '@/domain/use-cases/edit-account'
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

const editAccountBodySchema = z
  .object({
    name: z.string(),
    balance: z.number().min(0),
  })

const bodyValidationPipe = new ZodValidationPipe(editAccountBodySchema)
type EditAccountBodySchema = z.infer<typeof editAccountBodySchema>

@ApiTags('Accounts')
@Controller('/budgets/:budgetId/accounts/:id')
export class EditAccountController {
  constructor(private editAccount: EditAccountUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAccountBodySchema,
    @Param('id') accountId : string,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, balance } =
      body
    const { sub: ownerId } = user

    const result = await this.editAccount.execute({
      accountId,
      name,
      ownerId,
      balance
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
