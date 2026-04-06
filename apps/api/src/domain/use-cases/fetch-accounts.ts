import { Either, left, right } from "@/core/either";
import { Account } from "../entities/account";
import { AccountsRepository } from "../repositories/account-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FetchAccountsUseCaseRequest {
  budgetId: string;
}
type FetchAccountsUseCaseResponse = Either<ResourceNotFoundError, {
  accounts: Account[]
}>;



export class FetchAccountsUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute({ 
    budgetId 
  }: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
    const accounts = await this.accountsRepository.findMany(budgetId);
    if (accounts.length === 0) {
      return left(new ResourceNotFoundError());
    }
    return right({ accounts });
  }
}