import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Create Budget (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /budgets', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/budgets')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'My budget',
      })

    expect(response.statusCode).toEqual(201)

    const budgetOnDB = await prisma.budget.findFirst({
      where: {
        name: 'My budget',
      },
    })

    const userBudgetOnDB = await prisma.userBudget.findFirst({
      where: {
        userId: user.id.toString(),
        budgetId: budgetOnDB?.id,
      },
    })

    expect(budgetOnDB).toBeTruthy()
    expect(userBudgetOnDB).toBeTruthy()
  })
})
