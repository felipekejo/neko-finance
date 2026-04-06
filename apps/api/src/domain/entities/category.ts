import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type TypeTransaction = 'EXPENSES' | 'INCOMES'
export interface CategoryProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
  budgetId: UniqueEntityID
  type: TypeTransaction
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
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

  get budgetId() {
    return this.props.budgetId
  }

  get type() {
    return this.props.type
  }

  set type(type: TypeTransaction) {
    this.props.type = type
    this.touch()
  }

  static create(
    props: Optional<CategoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return category
  }
}
