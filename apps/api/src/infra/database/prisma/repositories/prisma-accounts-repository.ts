import { Account } from '@/domain/entities/account'
import { AccountsRepository, FindByNameProps } from '@/domain/repositories/account-repository'
import { Injectable } from '@nestjs/common'
import { PrismaAccountMapper } from '../mappers/prisma-accounts-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
  constructor(private prisma: PrismaService) {}

  async create(account: Account) {
    const data = PrismaAccountMapper.toPrisma(account)

    await this.prisma.account.create({
      data,
    })
  }

  async findById(id: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        id,
      },
    })

    if (!account) {
      return null
    }

    return PrismaAccountMapper.toDomain(account)
  }

  async delete(account: Account) {
    const data = PrismaAccountMapper.toPrisma(account)
    await this.prisma.account.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(account: Account) {
    const data = PrismaAccountMapper.toPrisma(account)

    await this.prisma.account.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
  async findMany(budgetId:string): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: {
        budgetId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return accounts.map(PrismaAccountMapper.toDomain)
  }

  async findByName({name, budgetId}: FindByNameProps) {
    const account = await this.prisma.account.findFirst({
      where: {
        name,
        budgetId
      }
    })

    if (!account) {
      return null
    }

    return PrismaAccountMapper.toDomain(account)
  }

}
