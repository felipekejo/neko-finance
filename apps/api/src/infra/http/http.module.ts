import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

import { AccountService } from '@/domain/service/account.service';
import { CategoryService } from '@/domain/service/category.service';
import { SubcategoryService } from '@/domain/service/subcategory.service';
import { TransactionService } from '@/domain/service/transaction.service';
import { AssignBudgetUseCase } from '@/domain/use-cases/assign-budget';
import { AuthenticateUserUseCase } from '@/domain/use-cases/authenticate';
import { CreateAccountUseCase } from '@/domain/use-cases/create-account';
import { CreateBudgetUseCase } from '@/domain/use-cases/create-budget';
import { CreateCategoryUseCase } from '@/domain/use-cases/create-category';
import { CreateSubcategoryUseCase } from '@/domain/use-cases/create-subcategory';
import { CreateTransactionUseCase } from '@/domain/use-cases/create-transaction';
import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import { DeleteAccountUseCase } from '@/domain/use-cases/delete-account';
import { DeleteBudgetUseCase } from '@/domain/use-cases/delete-budget';
import { DeleteCategoryUseCase } from '@/domain/use-cases/delete-category';
import { DeleteSubcategoryUseCase } from '@/domain/use-cases/delete-subcategory';
import { DeleteTransactionUseCase } from '@/domain/use-cases/delete-transaction';
import { EditAccountUseCase } from '@/domain/use-cases/edit-account';
import { EditCategoryUseCase } from '@/domain/use-cases/edit-category';
import { EditSubcategoryUseCase } from '@/domain/use-cases/edit-subcategory';
import { EditTransactionUseCase } from '@/domain/use-cases/edit-transaction';
import { FetchAccountsUseCase } from '@/domain/use-cases/fetch-accounts';
import { FetchCategoriesUseCase } from '@/domain/use-cases/fetch-categories';
import { FetchSubcategoriesUseCase } from '@/domain/use-cases/fetch-subcategories';
import { FetchTransactionsUseCase } from '@/domain/use-cases/fetch-transactions';
import { GetAccountByIdUseCase } from '@/domain/use-cases/get-account-by-id';
import { GetBudgetByIdUseCase } from '@/domain/use-cases/get-budget-by-id';
import { GetCategoryByIdUseCase } from '@/domain/use-cases/get-category-by-id';
import { GetSubcategoryByIdUseCase } from '@/domain/use-cases/get-subcategory-by-id';
import { GetTransactionByIdUseCase } from '@/domain/use-cases/get-transaction-by-id';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controller/authenticate.controller';
import { CreateAccountController } from './controller/create-account.controller';
import { CreateBudgetController } from './controller/create-budget.controller';
import { CreateCategoryController } from './controller/create-category.controller';
import { CreateSubcategoryController } from './controller/create-subcategory.controller';
import { CreateTransactionController } from './controller/create-transaction.controller';
import { CreateUserController } from './controller/create-user.controller';
import { AuthController } from './controller/auth.controller';
import { BetterAuthSignUpController } from './controller/better-auth-signup.controller';
import { ProfileController } from './controller/profile.controller';
import { EditAccountController } from './controller/edit-account.controller';
import { EditCategoryController } from './controller/edit-category.controller';
import { EditSubcategoryController } from './controller/edit-subcategory.controller';
import { EditTransactionController } from './controller/edit-transaction.controller';
import { FetchAccountsController } from './controller/fetch-accounts.controller';
import { FetchCategoriesController } from './controller/fetch-categories.controller';
import { FetchSubcategoriesController } from './controller/fetch-subcategories.controller';
import { FetchTransactionsController } from './controller/fetch-transactions.controller';
import { GetAccountByIdController } from './controller/get-accounts-by-id.controller';
import { GetBudgetByIdController } from './controller/get-budget-by-id.controller';
import { GetCategoryByIdController } from './controller/get-category-by-id.controller';
import { GetSubcategoryByIdController } from './controller/get-subcategory-by-id.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    CreateUserController,
    AuthenticateController,
    AuthController,
    BetterAuthSignUpController,
    ProfileController,
    CreateBudgetController,
    GetBudgetByIdController,
    CreateAccountController,
    CreateTransactionController,
    CreateCategoryController,
    FetchAccountsController,
    EditTransactionController,
    CreateSubcategoryController,
    FetchCategoriesController,
    FetchSubcategoriesController,
    FetchTransactionsController,
    GetAccountByIdController,
    GetCategoryByIdController,
    GetSubcategoryByIdController,
    EditAccountController,
    EditSubcategoryController,
    EditCategoryController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    CreateBudgetUseCase,
    CreateAccountUseCase,
    CreateTransactionUseCase,
    CreateCategoryUseCase,
    CreateSubcategoryUseCase,
    GetBudgetByIdUseCase,
    AssignBudgetUseCase,
    DeleteAccountUseCase,
    DeleteBudgetUseCase,
    DeleteTransactionUseCase,
    DeleteCategoryUseCase,
    DeleteSubcategoryUseCase,
    EditAccountUseCase,
    EditCategoryUseCase,
    EditSubcategoryUseCase,
    EditTransactionUseCase,
    FetchAccountsUseCase,
    FetchCategoriesUseCase,
    FetchSubcategoriesUseCase,
    GetAccountByIdUseCase,
    GetCategoryByIdUseCase,
    GetSubcategoryByIdUseCase,
    GetTransactionByIdUseCase,
    FetchTransactionsUseCase,
    TransactionService,
    AccountService,
    CategoryService,
    SubcategoryService,
  ],
})
export class HttpModule {}
