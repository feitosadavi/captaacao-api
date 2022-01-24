import { DbLoadAccounts } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { LoadAccountsController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadAccountsController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccounts = new DbLoadAccounts(accountMongoRepository)

  return new LoadAccountsController(loadAccounts)
}
