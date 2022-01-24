import { SignUpController } from '@/presentation/controllers/account/signup-controller'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/add-account/db-add-account'
import { makeSignUpValidation } from './signup-validation-factory'
import { LogMongoRepository } from '@/infra/db/mongodb'

export const makeSignUpController = (): Controller => {
  const logMongoRepository = new LogMongoRepository()
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
