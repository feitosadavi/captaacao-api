import { DbLoadAccounts } from '@/data/usecases/account/load-accounts/db-load-accounts'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountsController } from '@/presentation/controllers/account/load-accounts/load-accounts-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadAccountsController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccounts = new DbLoadAccounts(accountMongoRepository)

  return new LoadAccountsController(loadAccounts)
}
