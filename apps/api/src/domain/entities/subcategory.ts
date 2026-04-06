import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface SubcategoryProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
  categoryId: UniqueEntityID
}

export class Subcategory extends Entity<SubcategoryProps> {
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

  get categoryId() {
    return this.props.categoryId
  }

  static create(
    props: Optional<SubcategoryProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const subcategory = new Subcategory(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return subcategory
  }
}
