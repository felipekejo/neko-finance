import { Transaction } from "@/domain/entities/transaction";

export class TransactionPresenter {
  static toHTTP(transaction:Transaction){
    return{
      id: transaction.id.toString(),
      categoryId: transaction.categoryId.toString(),
      budgetId: transaction.budgetId.toString(),
      accountId: transaction.accountId.toString(),
      amount:transaction.amount,
      description:transaction.description,
      date:transaction.date,
      type: transaction.type,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }
  }
}