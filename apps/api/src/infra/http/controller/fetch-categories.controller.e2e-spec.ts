import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BudgetFactory } from 'test/factories/make-budget'
import { CategoryFactory } from 'test/factories/make-category'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Categories (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /budgets/:budgetId/categories/', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    await Promise.all([
      categoryFactory.makePrismaCategory({
        name:"category1",
        budgetId:budget.id,
      }),
      categoryFactory.makePrismaCategory({
        name:"category2",
        budgetId:budget.id,
      })
    ])



    const response = await request(app.getHttpServer())
      .get(`/budgets/${budget.id}/categories`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({
          name: 'category1',
        }),
        expect.objectContaining({
          name: 'category2',
        }),
      ]),
    })
  })
})
