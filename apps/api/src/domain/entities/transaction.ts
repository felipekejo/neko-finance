import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type TypeTransaction = 'EXPENSES' | 'INCOMES'
export interface TransactionProps {
  budgetId: UniqueEntityID
  accountId: UniqueEntityID
  description: string
  amount: number
  createdAt: Date
  updatedAt?: Date | null
  type: TypeTransaction
  date: Date
  categoryId: UniqueEntityID
  subcategoryId?: UniqueEntityID | null
}

export class Transaction extends Entity<TransactionProps> {
  get budgetId() {
    return this.props.budgetId
  }

  get accountId() {
    return this.props.accountId
  }

  get categoryId() {
    return this.props.categoryId
  }

  set accountId(accountId: UniqueEntityID) {
    this.props.accountId = accountId
    this.touch()
  }

  set categoryId(categoryId: UniqueEntityID) {
    this.props.categoryId = categoryId
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get amount() {
    return this.props.amount
  }

  set amount(amount: number) {
    this.props.amount = amount
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get type() {
    return this.props.type
  }

  set type(type: TypeTransaction) {
    this.props.type = type
    this.touch()
  }

  get date() {
    return this.props.date
  }

  set date(date: Date) {
    this.props.date = date
    this.touch()
  }

  static create(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return transaction
  }
}
