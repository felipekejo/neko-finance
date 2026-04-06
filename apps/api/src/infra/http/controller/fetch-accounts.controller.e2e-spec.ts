import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { BudgetFactory } from 'test/factories/make-budget'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Accounts (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let accountFactory: AccountFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory, AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    accountFactory = moduleRef.get(AccountFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /budgets/:budgetId/accounts', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    await Promise.all([
      accountFactory.makePrismaAccount({
        name:"account1",
        budgetId:budget.id,
        ownerId:user.id
      }),
      accountFactory.makePrismaAccount({
        name:"account2",
        budgetId:budget.id,
        ownerId:user.id
      })
    ])



    const response = await request(app.getHttpServer())
      .get(`/budgets/${budget.id}/accounts`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      accounts: expect.arrayContaining([
        expect.objectContaining({
          name: 'account1',
        }),
        expect.objectContaining({
          name: 'account2',
        }),
      ]),
    })
  })
})
