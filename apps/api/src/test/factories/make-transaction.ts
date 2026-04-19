import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/entities/transaction'
import { faker } from '@faker-js/faker'

enum TypeTransaction {
  EXPENSES = 'EXPENSES',
  INCOMES = 'INCOMES',
}

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
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
