import { Either, left, right } from "@/core/either";
import { Category } from "../entities/category";
import { CategoriesRepository } from "../repositories/category-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchCategoriesUseCaseRequest {
  budgetId: string;
}
type FetchCategoriesUseCaseResponse = Either<ResourceNotFoundError, {
  categories: Category[]
}>;
export class FetchCategoriesUseCase{
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute(
    {budgetId}: FetchCategoriesUseCaseRequest
  ): Promise<FetchCategoriesUseCaseResponse> {


    const categories = await this.categoriesRepository.findMany({}, budgetId);

    if (categories.length === 0) {
      return left(new ResourceNotFoundError());
    }

    return right({ categories });
  }
}