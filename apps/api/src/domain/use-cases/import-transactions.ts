import { right } from '@/core/either'
import { Transaction } from '@/domain/entities/transaction'
import { parse } from 'csv-parse/sync'
import { AccountsRepository } from '../repositories/account-repository'
import { CategoriesRepository } from '../repositories/category-repository'
import { SubcategoriesRepository } from '../repositories/subcategory-repository'
import { AccountService } from '../service/account.service'
import { CategoryService } from '../service/category.service'
import { SubcategoryService } from '../service/subcategory.service'
import { TransactionService } from '../service/transaction.service'

interface ImportTransactionsRequest {
  budgetId: string
  ownerId: string
  csvBuffer: Buffer
}

type csvRow = {
  description: string
  amount: string
  date: string
  category: string
  account: string
  type: 'INCOMES' | 'EXPENSES'
  subcategory: string
}

export class ImportTransactionsUseCase {
  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private subcategoryService: SubcategoryService,
    private accountsRepository: AccountsRepository,
    private categoriesRepository: CategoriesRepository,
    private subcategoriesRepository: SubcategoriesRepository,
  ) {}

  async execute({ budgetId, ownerId, csvBuffer }: ImportTransactionsRequest) {
    const results: Transaction[] = []

    const rows: csvRow[] = await this.parseCsv(csvBuffer)

    for (const row of rows) {
      let category
      let account
      let subcategory

        category = await this.categoriesRepository.findByName({
          name: row.category,
          budgetId: budgetId,
        })
        if (!category) {
          const createdCategory = await this.categoryService.create({
              name: row.category,
              budgetId: budgetId,
              type: row.type
            })

          if (createdCategory.isLeft()) continue
          category = createdCategory.value.category
        }

        subcategory = await this.subcategoriesRepository.findByName( 
          row.subcategory
        )

        if(!subcategory){
          const createdSubcategory = await this.subcategoryService.create({
            name: row.subcategory,
            categoryId: category.id.toString()
          })

          if (createdSubcategory.isLeft()) continue
          subcategory = createdSubcategory.value.subcategory
        }

        account = await this.accountsRepository.findByName({
          name: row.account,
          budgetId: budgetId,
        })

        if(!account){
          const createdAccount = await this.accountService.createAccount({
            name: row.account,
            budgetId: budgetId,
            balance: 0,
            ownerId
          })

          if (createdAccount.isLeft()) continue
          account = createdAccount.value.account
        }


      const transaction = await this.transactionService.createTransaction({
        description: row.description,
        amount: parseFloat(row.amount),
        date: new Date(row.date),
        budgetId,
        categoryId: category.id.toString(),
        accountId: account.id.toString(),
        type: row.type,
        subcategoryId: subcategory.id.toString(),
      })

      if (transaction.isLeft()) {
        continue
      }
      results.push(transaction.value.transaction)
    }

    return right({ imported: results.length })
  }

  private parseCsv(buffer: Buffer) {
    return parse<csvRow>(buffer, {
      columns: true,
      skip_empty_lines: true,
    })
  }
}