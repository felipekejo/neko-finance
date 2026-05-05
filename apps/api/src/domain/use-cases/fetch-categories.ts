import { Either, left, right } from "@/core/either";
import { Category } from "../entities/category";
import { CategoriesRepository } from "../repositories/category-repository";
import { UserBudgetRepository } from "../repositories/user-budget-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

interface FetchCategoriesUseCaseRequest {
  budgetId: string;
  userId: string;
  type?: 'EXPENSES' | 'INCOMES';
}

type FetchCategoriesUseCaseResponse = Either<ResourceNotFoundError | UnauthorizedError, {
  categories: Category[]
}>;

export class FetchCategoriesUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({ budgetId, userId, type }: FetchCategoriesUseCaseRequest): Promise<FetchCategoriesUseCaseResponse> {
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, budgetId)
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const categories = await this.categoriesRepository.findMany({ type }, budgetId);
    if (categories.length === 0) {
      return left(new ResourceNotFoundError());
    }
    return right({ categories });
  }
}
