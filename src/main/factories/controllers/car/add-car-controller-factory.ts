import { LogMongoRepository, CarMongoRepository } from '@/infra/db/mongodb'
import { AddCarController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddCarValidation } from '@/main/factories'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeAddCarController = (): Controller => {
  const carMongoRepository = new CarMongoRepository()
  const addCarController = new AddCarController(makeAddCarValidation(), carMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addCarController, logMongoRepository)
}
