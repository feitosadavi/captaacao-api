import { DbDeletePost, DbLoadPostById } from '@/data/usecases'
import { PostMongoRepository } from '@/infra/db/mongodb'
import { DeletePostController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeDeletePostController = (): Controller => {
  const accountMongoRepository = new PostMongoRepository()

  const dbLoadPostById = new DbLoadPostById(accountMongoRepository)
  const dbDeletePost = new DbDeletePost(accountMongoRepository)

  return new DeletePostController(dbDeletePost, dbLoadPostById)
}
