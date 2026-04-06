import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { BudgetFactory } from 'test/factories/make-budget'
import { CategoryFactory } from 'test/factories/make-category'
import { SubcategoryFactory } from 'test/factories/make-subcategory'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Subcategories (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let categoryFactory: CategoryFactory
  let subcategoryFactory: SubcategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory, CategoryFactory, SubcategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    subcategoryFactory = moduleRef.get(SubcategoryFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /subcategories/$categoryId', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const accessToken = jwt.sign({ sub: user.id.toString() })
    const category = await categoryFactory.makePrismaCategory({
      budgetId:budget.id
    })
    await Promise.all([
      subcategoryFactory.makePrismaSubcategory({
        name:"subcategory1",
        categoryId:category.id,
      }),
      subcategoryFactory.makePrismaSubcategory({
        name:"subcategory2",
        categoryId:category.id,
      })
    ])



    const response = await request(app.getHttpServer())
      .get(`/subcategories/${category.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body).toEqual({
      subcategories: expect.arrayContaining([
        expect.objectContaining({
          name: 'subcategory1',
        }),
        expect.objectContaining({
          name: 'subcategory2',
        }),
      ]),
    })
  })
})
