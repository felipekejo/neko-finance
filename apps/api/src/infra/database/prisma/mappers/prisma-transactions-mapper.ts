import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction } from '@/domain/entities/transaction'
import { Prisma, Transaction as PrismaTransaction } from '@prisma/client'

export class PrismaTransactionsMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create(
      {
        amount: raw.amount,
        type: raw.type,
        description: raw.description,
        accountId: new UniqueEntityID(raw.accountId),
        budgetId: new UniqueEntityID(raw.budgetId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        date: raw.date,
        categoryId: new UniqueEntityID(raw.categoryId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    transaction: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: transaction.id.toString(),
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      categoryId: transaction.categoryId.toString(),
      accountId: transaction.accountId.toString(),
      budgetId: transaction.budgetId.toString(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      date: transaction.date,
    }
  }
}
