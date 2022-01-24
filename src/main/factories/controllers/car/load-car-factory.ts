import { DbLoadCars } from '@/data/usecases'
import { CarMongoRepository } from '@/infra/db/mongodb'
import { LoadCarsController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadCarController = (): Controller => {
  const carMongoRepository = new CarMongoRepository()
  const dbLoadCars = new DbLoadCars(carMongoRepository)
  return new LoadCarsController(dbLoadCars)
}
