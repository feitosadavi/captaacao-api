import { DbLoadAccountById } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { LoadAccountByIdController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadAccountByIdController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbLoadAccountById = new DbLoadAccountById(accountMongoRepository)
  return new LoadAccountByIdController(dbLoadAccountById)
}
