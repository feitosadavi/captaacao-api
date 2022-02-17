import { LogMongoRepository, ProfileMongoRepository } from '@/infra/db/mongodb'
import { AddProfileController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddProfileValidation } from '@/main/factories'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeAddProfileController = (): Controller => {
  const profileMongoRepository = new ProfileMongoRepository()
  const addProfileController = new AddProfileController(makeAddProfileValidation(), profileMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addProfileController, logMongoRepository)
}
