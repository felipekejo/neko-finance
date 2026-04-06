import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BudgetFactory } from 'test/factories/make-budget'
import { UserFactory } from 'test/factories/make-user'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /budgets/:budgetId/accounts', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post(`/budgets/${budget.id}/accounts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'My Account',
        balance: 0,
      })

    expect(response.statusCode).toEqual(201)

    const accountOnDB = await prisma.account.findFirst({
      where: {
        name: 'My Account',
      },
    })

    expect(accountOnDB).toBeTruthy()
  })
})
