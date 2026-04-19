import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Account, AccountProps } from '@/domain/entities/account'
import { faker } from '@faker-js/faker'

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
