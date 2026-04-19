import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Subcategory, SubcategoryProps } from '@/domain/entities/subcategory'
import { faker } from '@faker-js/faker'

export function makeSubcategory(
  override: Partial<SubcategoryProps> = {},
  id?: UniqueEntityID,
) {
  const subcategory = Subcategory.create(
    {
      name: faker.lorem.sentence(),
      categoryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return subcategory
}
