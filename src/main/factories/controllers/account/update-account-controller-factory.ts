import { DbUpdateAccount } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { Controller } from '@/presentation/protocols'
import { UpdateAccountController } from '@/presentation/controllers'
import { makeUpdateAccountValidationFactory } from '.'

export const makeUpdateAccountControllerFactory = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbUpdateAccount(accountMongoRepository, accountMongoRepository)
  return new UpdateAccountController(makeUpdateAccountValidationFactory(), dbUpdateAccount)
}
