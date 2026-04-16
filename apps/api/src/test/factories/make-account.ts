import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Account, AccountProps } from '@/domain/entities/account'
import { PrismaAccountMapper } from '@/infra/database/prisma/mappers/prisma-accounts-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeAccount(
  override: Partial<AccountProps> = {},
  id?: UniqueEntityID,
) {
  const account = Account.create(
    {
      name: faker.lorem.sentence(),
      ownerId: new UniqueEntityID(),
      budgetId: new UniqueEntityID(),
      balance: 0,
      ...override,
    },
    id,
  )

  return account
}

@Injectable()
export class AccountFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAccount(data: Partial<AccountProps> = {}): Promise<Account> {
    const account = makeAccount(data)
    await this.prisma.account.create({
      data: PrismaAccountMapper.toPrisma(account),
    })

    return account
  }
}
