import { CreateUserUseCase } from '@/domain/use-cases/create-user'
import { UserAlreadyExistError } from '@/domain/use-cases/errors/user-already-exist-error'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateUserSwaggerDto } from '../swagger-dtos/create-user.swagger.dto'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'CLIENT']),
})
type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@ApiTags('Users')
@Controller('/users')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @ApiBody({ type: CreateUserSwaggerDto })
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const { name, email, password, role } = body

    const result = await this.createUser.execute({
      name,
      email,
      password,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
