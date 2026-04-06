import { UsersRepository } from '@/domain/repositories/user-repository'
import { Injectable } from '@nestjs/common'

import { User } from '@/domain/entities/user'
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async create(user: User) {
    const data = PrismaUsersMapper.toPrisma(user)
    await this.prisma.user.create({
      data,
    })
  }
}
