import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-account'
import { BudgetFactory } from 'test/factories/make-budget'
import { UserFactory } from 'test/factories/make-user'

describe('Edit Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    accountFactory = moduleRef.get(AccountFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /categories', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const account = await accountFactory.makePrismaAccount({
      budgetId: budget.id,
      ownerId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })


    const response = await request(app.getHttpServer())
      .put(`/budgets/${budget.id}/accounts/${account.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'My Account 1',
        balance: 200,
        ownerId:user.id,
        accountId:account.id.toString()
      })
    expect(response.statusCode).toEqual(204)

    const accountOnDB = await prisma.account.findFirst({
      where: {
        id: account.id.toString(),
        ownerId: user.id.toString(),
      },
    })

    expect(accountOnDB).toBeTruthy()
    expect(accountOnDB?.balance).toBe(200)
    expect(accountOnDB?.name).toBe('My Account 1')
  })
})
