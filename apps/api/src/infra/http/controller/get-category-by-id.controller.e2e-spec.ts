import { AppModule } from "@/infra/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from "test/factories/make-account"
import { BudgetFactory } from "test/factories/make-budget"
import { CategoryFactory } from "test/factories/make-category"
import { UserFactory } from "test/factories/make-user"


describe('Get Category by Id (E2E)', () => {
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
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    await app.init()
  })
  test('[GET] /categories', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget({
      name: 'My budget',
    })
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const account = await accountFactory.makePrismaAccount({
      budgetId: budget.id,
      ownerId: user.id,
    })
    const category = await categoryFactory.makePrismaCategory({
      budgetId: budget.id,
      name: 'My category',
    })

    const response = await request(app.getHttpServer())
      .get(`/budgets/${budget.id}/categories/${category.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      category: expect.objectContaining({
        name: 'My category',
      }),
    })
  })
})