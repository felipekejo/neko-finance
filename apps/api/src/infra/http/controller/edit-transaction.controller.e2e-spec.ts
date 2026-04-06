import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { BudgetFactory } from 'test/factories/make-budget'
import { CategoryFactory } from 'test/factories/make-category'
import { TransactionFactory } from 'test/factories/make-transaction'
import { UserFactory } from 'test/factories/make-user'

describe('Edit Transaction (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let transactionFactory: TransactionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory, AccountFactory, CategoryFactory,TransactionFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    transactionFactory = moduleRef.get(TransactionFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /transactions', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const account = await accountFactory.makePrismaAccount({
      budgetId: budget.id,
      ownerId: user.id,
    })

    const category = await categoryFactory.makePrismaCategory({
      budgetId: budget.id,
      type: 'INCOMES',
    })
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const transaction = await transactionFactory.makePrismaTransaction({
      description: 'My Transaction',
      type: 'INCOMES',
      budgetId: budget.id,
      amount: 100,
      accountId: account.id,
      categoryId: category.id
    })

    const response = await request(app.getHttpServer())
      .put(`/budgets/${budget.id}/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'My Transaction 1',
        type: 'EXPENSES',
        amount: 200,
        ownerId:user.id,
        accountId:account.id.toString()
      })
    expect(response.statusCode).toEqual(204)

    const transactionOnDB = await prisma.transaction.findFirst({
      where: {
        description: 'My Transaction 1',
        type: 'EXPENSES',
        amount: 200,
      },
    })

    expect(transactionOnDB).toBeTruthy()
    expect(transactionOnDB?.type).toBe('EXPENSES')
    expect(transactionOnDB?.description).toBe('My Transaction 1')
  })
})
