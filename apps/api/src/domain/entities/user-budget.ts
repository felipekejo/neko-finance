import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface UserBudgetProps {
  userId: UniqueEntityID
  budgetId: UniqueEntityID
  createdAt: Date
}

export class UserBudget extends Entity<UserBudgetProps> {
  get userId() {
    return this.props.userId
  }

  get budgetId() {
    return this.props.budgetId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<UserBudgetProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const userBudget = new UserBudget(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return userBudget
  }
}
