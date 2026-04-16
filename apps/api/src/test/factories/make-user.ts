import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/entities/user'
import { PrismaUsersMapper } from '@/infra/database/prisma/mappers/prisma-users-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const account = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: 'CLIENT',
      ...override,
    },
    id,
  )

  return account
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)
    await this.prisma.user.create({ data: PrismaUsersMapper.toPrisma(user) })

    return user
  }
}
