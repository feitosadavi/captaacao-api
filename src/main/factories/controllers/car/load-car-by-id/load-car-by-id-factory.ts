import { DbLoadCarById } from '@/data/usecases/car/load-car-by-id'
import { CarMongoRepository } from '@/infra/db/mongodb/car/car-mongo-repository'
import { LoadCarByIdController } from '@/presentation/controllers/car/load-car-by-id/load-car-by-id'
import { Controller } from '@/presentation/protocols'

export const makeLoadCarByIdController = (): Controller => {
  const carMongoRepository = new CarMongoRepository()
  const dbLoadCarById = new DbLoadCarById(carMongoRepository)
  return new LoadCarByIdController(dbLoadCarById)
}
