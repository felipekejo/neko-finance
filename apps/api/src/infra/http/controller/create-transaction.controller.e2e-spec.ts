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
import { UserFactory } from 'test/factories/make-user'

describe('Create Transaction (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory, AccountFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /budgets/:budgetId/transactions', async () => {
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

    const response = await request(app.getHttpServer())
      .post(`/budgets/${budget.id}/transactions`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'My Transaction',
        type: 'INCOMES',
        amount: 100,
        accountId: account.id.toString(),
        date: '2023-10-01',
        categoryId: category.id.toString(),
      })
    expect(response.statusCode).toEqual(201)

    const transactionOnDB = await prisma.transaction.findFirst({
      where: {
        description: 'My Transaction',
      },
    })

    expect(transactionOnDB).toBeTruthy()
  })
})
