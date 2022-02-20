import { DbLoadCarById } from '@/data/usecases'
import { CarMongoRepository } from '@/infra/db/mongodb'
import { LoadCarByIdController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadCarByIdController = (): Controller => {
  const carMongoRepository = new CarMongoRepository()
  const dbLoadCarById = new DbLoadCarById(carMongoRepository)
  return new LoadCarByIdController(dbLoadCarById)
}
