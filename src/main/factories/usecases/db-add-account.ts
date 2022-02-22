import { AddAccount } from '@/domain/usecases'
import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db/mongodb'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12

  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(salt)
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)
}
