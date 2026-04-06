import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { BudgetFactory } from 'test/factories/make-budget'
import { UserFactory } from 'test/factories/make-user'

describe('Get Account (E2E)', () => {
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

  test('[GET] /budgets/:budgetId/accounts/:accountId', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget({
      name: 'My budget',
    })
    const account1 = await accountFactory.makePrismaAccount({
      budgetId:budget.id,
      name:"Account 1",
      ownerId: user.id,
    }) 

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/budgets/${budget.id}/accounts/${account1.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      account: expect.objectContaining({
        name: 'Account 1',
      }),
    })
  })
})
