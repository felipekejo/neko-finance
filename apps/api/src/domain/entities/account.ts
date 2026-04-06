import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { TypeTransaction } from './transaction'

export interface AccountProps {
  ownerId: UniqueEntityID
  budgetId: UniqueEntityID
  name: string
  createdAt: Date
  updatedAt?: Date | null
  balance: number
}

export class Account extends AggregateRoot<AccountProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get ownerId() {
    return this.props.ownerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get budgetId() {
    return this.props.budgetId
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get balance() {
    return this.props.balance
  }

  set balance(balance: number) {
    this.props.balance = balance
    this.touch()
  }

  applyTransaction(amount: number, type: TypeTransaction) {
    if (type === 'INCOMES') {
      this.props.balance += amount
    } else if (type === 'EXPENSES') {
      this.props.balance -= amount
    }
    this.touch()
  }


  revertTransaction(amount: number, type: TypeTransaction) {
    if (type === 'INCOMES') {
      this.props.balance -= amount
    } else if (type === 'EXPENSES') {
      this.props.balance += amount
    }
    this.touch()
  }

  static create(
    props: Optional<AccountProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const account = new Account(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return account
  }
}
