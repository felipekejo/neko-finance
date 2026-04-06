import { Category } from '../entities/category'

export interface CategoriesFilter {
  type?: 'EXPENSES' | 'INCOMES'
}
export interface FindByNameProps {
  name: string
  budgetId: string
}

export abstract class CategoriesRepository {
  abstract create(category: Category): Promise<void>
  abstract findById(id: string): Promise<Category | null>
  abstract delete(category: Category): Promise<void>
  abstract save(category: Category): Promise<void>
  abstract findMany(filters:CategoriesFilter, budgetId:string): Promise<Category[]>
  abstract findByName({name, budgetId}: FindByNameProps): Promise<Category | null>
}
