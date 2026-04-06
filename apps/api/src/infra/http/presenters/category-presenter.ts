import { Category } from "@/domain/entities/category";

export class CategoryPresenter {
  static toHTTP(category:Category){
    return {
      id: category.id.toString(),
      name:category.name,
      type:category.type,
      budgetId:category.budgetId.toString(),
      createdAt:category.createdAt,
      updatedAt:category.updatedAt
    }
  }
}