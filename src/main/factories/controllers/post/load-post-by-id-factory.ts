import { DbLoadPostById } from '@/data/usecases'
import { PostMongoRepository } from '@/infra/db/mongodb'
import { LoadPostByIdController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadPostByIdController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const dbLoadPostById = new DbLoadPostById(postMongoRepository)
  return new LoadPostByIdController(dbLoadPostById)
}
