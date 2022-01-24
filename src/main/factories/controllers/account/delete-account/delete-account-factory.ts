import { DbDeleteAccount } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { DeleteAccountController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeDeleteAccountsController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbDeleteAccount = new DbDeleteAccount(accountMongoRepository)

  return new DeleteAccountController(dbDeleteAccount)
}
