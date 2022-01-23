import { DbDeleteAccount } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { DeleteAccountController } from '@/presentation/controllers/account/delete-account/delete-account-controller'
import { Controller } from '@/presentation/protocols'

export const makeDeleteAccountsController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbDeleteAccount = new DbDeleteAccount(accountMongoRepository)

  return new DeleteAccountController(dbDeleteAccount)
}
