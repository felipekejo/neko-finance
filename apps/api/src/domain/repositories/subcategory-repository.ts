import { Subcategory } from '../entities/subcategory';

export abstract class SubcategoriesRepository {
  abstract create(subcategory: Subcategory): Promise<void>
  abstract findById(id: string): Promise<Subcategory | null>
  abstract delete(subcategory: Subcategory): Promise<void>
  abstract save(subcategory: Subcategory): Promise<void>
  abstract findMany(categoryId: string): Promise<Subcategory[]>
  abstract findByName(name: string): Promise<Subcategory | null>
}
