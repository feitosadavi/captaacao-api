import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { CarMongoRepository } from '@/infra/db/mongodb/car/car-mongo-repository'
import { AddCarController } from '@/presentation/controllers/car/add-car/add-car-controller'
import { Controller } from '@/presentation/protocols'
import { makeAddCarValidation } from './add-car-validation-factory'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeAddCarController = (): Controller => {
  const carMongoRepository = new CarMongoRepository()
  const addCarController = new AddCarController(makeAddCarValidation(), carMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addCarController, logMongoRepository)
}
