import { DbLoadAccountByCode } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { CheckCodeController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { CodeExpirationValidation, CodeMatchesValidation } from '@/presentation/validators'
import { makeCheckCodeValidation } from '.'

export const makeCheckCodeController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbLoadAccountByCode = new DbLoadAccountByCode(accountMongoRepository)

  const codeMatches = new CodeMatchesValidation()
  const codeExpiration = new CodeExpirationValidation()

  return new CheckCodeController(makeCheckCodeValidation(), dbLoadAccountByCode, codeMatches, codeExpiration)
}
