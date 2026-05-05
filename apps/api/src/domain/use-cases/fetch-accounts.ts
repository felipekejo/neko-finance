import { Either, left, right } from "@/core/either";
import { Account } from "../entities/account";
import { AccountsRepository } from "../repositories/account-repository";
import { UserBudgetRepository } from "../repositories/user-budget-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UnauthorizedError } from "./errors/unauthorized-error";

interface FetchAccountsUseCaseRequest {
  budgetId: string;
  userId: string;
}

type FetchAccountsUseCaseResponse = Either<ResourceNotFoundError | UnauthorizedError, {
  accounts: Account[]
}>;

export class FetchAccountsUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private userBudgetRepository: UserBudgetRepository,
  ) {}

  async execute({
    budgetId,
    userId,
  }: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
    const userBudget = await this.userBudgetRepository.findByUserIdAndBudgetId(userId, budgetId)
    if (!userBudget) {
      return left(new UnauthorizedError())
    }

    const accounts = await this.accountsRepository.findMany(budgetId);
    if (accounts.length === 0) {
      return left(new ResourceNotFoundError());
    }
    return right({ accounts });
  }
}
