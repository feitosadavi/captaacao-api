import { Controller } from '@/presentation/protocols'
import { UpdatePasswordController } from '@/presentation/controllers'
import { DbUpdatePassword } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { makeUpdatePasswordValidation } from '.'
import { BcryptAdapter } from '@/infra/cryptography'

export const makeUpdatePasswordControllerFactory = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdatePassword = new DbUpdatePassword(bcryptAdapter, accountMongoRepository)
  return new UpdatePasswordController(makeUpdatePasswordValidation(), dbUpdatePassword)
}
