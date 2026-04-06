import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { User } from '../entities/user'
import { UsersRepository } from '../repositories/user-repository'
import { UserAlreadyExistError } from './errors/user-already-exist-error'

type UserRole = 'ADMIN' | 'CLIENT'
interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })
    await this.usersRepository.create(user)
    return right({ user })
  }
}
