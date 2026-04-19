import { CreateAccountUseCase } from '@/domain/use-cases/create-account'
import { DeleteAccountUseCase } from '@/domain/use-cases/delete-account'
import { EditAccountUseCase } from '@/domain/use-cases/edit-account'
import { FetchAccountsUseCase } from '@/domain/use-cases/fetch-accounts'
import { GetAccountByIdUseCase } from '@/domain/use-cases/get-account-by-id'
import { PrismaAccountsRepository } from '@/infra/database/prisma/repositories/prisma-accounts-repository'
import { prisma } from '@/lib/prisma'

function accountsRepository() {
  return new PrismaAccountsRepository(prisma)
}

export function makeCreateAccountUseCase() {
  return new CreateAccountUseCase(accountsRepository())
}

export function makeDeleteAccountUseCase() {
  return new DeleteAccountUseCase(accountsRepository())
}

export function makeEditAccountUseCase() {
  return new EditAccountUseCase(accountsRepository())
}

export function makeFetchAccountsUseCase() {
  return new FetchAccountsUseCase(accountsRepository())
}

export function makeGetAccountByIdUseCase() {
  return new GetAccountByIdUseCase(accountsRepository())
}
