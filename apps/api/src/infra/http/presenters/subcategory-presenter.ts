import { Subcategory } from "@/domain/entities/subcategory";

export class SubcategoryPresenter {
  static toHTTP(subcategory:Subcategory){
    return {
      id: subcategory.id.toString(),
      name:subcategory.name,
      categoryId: subcategory.categoryId.toString(),
      createdAt:subcategory.createdAt,
      updatedAt:subcategory.updatedAt
    }
  }
}