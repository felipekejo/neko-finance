import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BudgetFactory } from 'test/factories/make-budget'
import { CategoryFactory } from 'test/factories/make-category'
import { UserFactory } from 'test/factories/make-user'

describe('Create Subcategory (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let categoryFactory:CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory,CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    categoryFactory = moduleRef.get(CategoryFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[POST] /subcategories', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const category = await categoryFactory.makePrismaCategory({
      budgetId:budget.id
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/subcategories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'First Subcategory',
        categoryId:category.id.toString()
      })

    expect(response.statusCode).toEqual(201)

    const subcategoryOnDB = await prisma.subCategory.findFirst({
      where: {
        name: 'First Subcategory',
      },
    })

    expect(subcategoryOnDB).toBeTruthy()
  })
})
