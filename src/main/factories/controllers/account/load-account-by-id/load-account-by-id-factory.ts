import { DbLoadAccountById } from '@/data/usecases/account/db-load-account-by-id'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByIdController } from '@/presentation/controllers/account/load-account-by-id/load-account-by-id'
import { Controller } from '@/presentation/protocols'

export const makeLoadAccountByIdController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbLoadAccountById = new DbLoadAccountById(accountMongoRepository)
  return new LoadAccountByIdController(dbLoadAccountById)
}
