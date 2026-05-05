import { Either, left, right } from "@/core/either";
import { Subcategory } from "../entities/subcategory";
import { CategoriesRepository } from "../repositories/category-repository";
import { SubcategoriesRepository } from "../repositories/subcategory-repository";
import { UserBudgetRepository } from "../repositories/user-budget-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

interface FetchSubcategoriesUseCaseRequest {
  categoryId: string;
  userId: string;
}

type FetchSubcategoriesUseCaseResponse = Either<ResourceNotFoundError | UnauthorizedError, {
  subcategories: Subcategory[]
}>;

export class FetchSubcategoriesUseCase {
  constructor(
    private subcategories: SubcategoriesRepository,
    private categoriesRepository: CategoriesRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({ categoryId, userId }: FetchSubcategoriesUseCaseRequest): Promise<FetchSubcategoriesUseCaseResponse> {
    const category = await this.categoriesRepository.findById(categoryId)
    if (!category) {
      return left(new ResourceNotFoundError())
    }

    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(
      userId,
      category.budgetId.toString(),
    )
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const subcategories = await this.subcategories.findMany(categoryId)
    if (subcategories.length === 0) {
      return left(new ResourceNotFoundError())
    }
    return right({ subcategories })
  }
}
