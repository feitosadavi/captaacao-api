import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import { makeDbAuthentication } from '@/main/factories/usecases'
import { makeDbAddAccount } from '@/main/factories'
import { makeSignUpValidation } from './signup-validation-factory'
import { LogMongoRepository } from '@/infra/db/mongodb'

export const makeSignUpController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
