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
import { SubcategoryFactory } from 'test/factories/make-subcategory'
import { UserFactory } from 'test/factories/make-user'

describe('Edit Subcategory (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userFactory: UserFactory
  let budgetFactory: BudgetFactory
  let accountFactory: AccountFactory
  let categoryFactory: CategoryFactory
  let subcategoryFactory: SubcategoryFactory


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BudgetFactory, AccountFactory, CategoryFactory, SubcategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    budgetFactory = moduleRef.get(BudgetFactory)
    accountFactory = moduleRef.get(AccountFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    subcategoryFactory = moduleRef.get(SubcategoryFactory)

    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /subcategories', async () => {
    const user = await userFactory.makePrismaUser()
    const budget = await budgetFactory.makePrismaBudget()
    const account = await accountFactory.makePrismaAccount({
      budgetId: budget.id,
      ownerId: user.id,
    })

    const category = await categoryFactory.makePrismaCategory({
      budgetId: budget.id,
    })

    const subcategory = await subcategoryFactory.makePrismaSubcategory({
      categoryId: category.id,
      name: 'My Subcategory 1',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })


    const response = await request(app.getHttpServer())
      .put(`/budgets/${budget.id}/subcategories/${subcategory.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Subcategory',
        categoryId: category.id.toString(),
      })

    expect(response.statusCode).toEqual(204)

    const subcategoryOnDB = await prisma.subCategory.findFirst({
      where: {
        id: subcategory.id.toString(),
        name: 'New Subcategory'
      },
    })

    expect(subcategoryOnDB).toBeTruthy()
    expect(subcategoryOnDB?.name).toBe('New Subcategory')
  })
})
