import { DbLoadAllAccounts } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { LoadAllAccountsController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadAllAccountsController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccounts = new DbLoadAllAccounts(accountMongoRepository)

  return new LoadAllAccountsController(loadAccounts)
}
