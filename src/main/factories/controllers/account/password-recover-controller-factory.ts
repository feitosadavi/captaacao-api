import { DbLoadIdByEmail, DbPasswordRecover } from '@/data/usecases'
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb'
import { CodeGenerator } from '@/infra/others'
import { NodemailerAdapter } from '@/infra/messaging'
import { PasswordRecoverController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makePasswordRecoverValidation } from './password-recover-validation-factory'

export const makeLoginController = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const codeGenerator = new CodeGenerator()
  const nodemailerAdapter = new NodemailerAdapter()

  const dbLoadByEmail = new DbLoadIdByEmail(accountMongoRepository)
  const dbPasswordRecover = new DbPasswordRecover(accountMongoRepository, codeGenerator, nodemailerAdapter)

  const passwordRecoverController = new PasswordRecoverController(makePasswordRecoverValidation(), dbLoadByEmail, dbPasswordRecover)
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(passwordRecoverController, logMongoRepository)
}
