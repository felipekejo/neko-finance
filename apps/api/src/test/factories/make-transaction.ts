import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/entities/transaction'
import { PrismaTransactionsMapper } from '@/infra/database/prisma/mappers/prisma-transactions-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
  enum TypeTransaction {
    EXPENSES = 'EXPENSES',
    INCOMES = 'INCOMES',
  }
  const transaction = Transaction.create(
    {
      description: faker.lorem.sentence(),
      accountId: new UniqueEntityID(),
      budgetId: new UniqueEntityID(),
      categoryId: new UniqueEntityID(),
      amount: faker.number.int(),
      type: faker.helpers.enumValue(TypeTransaction),
      date: faker.date.recent(),
      ...override,
    },
    id,
  )

  return transaction
}

@Injectable()
export class TransactionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTransaction(
    data: Partial<TransactionProps> = {},
  ): Promise<Transaction> {
    const transaction = makeTransaction(data)
    await this.prisma.transaction.create({
      data: PrismaTransactionsMapper.toPrisma(transaction),
    })

    return transaction
  }
}
