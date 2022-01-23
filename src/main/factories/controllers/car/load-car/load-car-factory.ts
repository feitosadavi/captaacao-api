import { DbLoadCars } from '@/data/usecases'
import { CarMongoRepository } from '@/infra/db/mongodb/car/car-mongo-repository'
import { LoadCarsController } from '@/presentation/controllers/car/load-car/load-cars'
import { Controller } from '@/presentation/protocols'

export const makeLoadCarController = (): Controller => {
  const carMongoRepository = new CarMongoRepository()
  const dbLoadCars = new DbLoadCars(carMongoRepository)
  return new LoadCarsController(dbLoadCars)
}
