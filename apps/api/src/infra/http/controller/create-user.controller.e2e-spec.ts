import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create User (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })
  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'j@j.com',
      password: '123456',
      role: 'CLIENT',
    })

    expect(response.statusCode).toEqual(201)

    const user = await prisma.user.findUnique({
      where: {
        email: 'j@j.com',
      },
    })

    expect(user).toBeTruthy()
    expect(user?.role).toEqual('CLIENT')
  })
})
