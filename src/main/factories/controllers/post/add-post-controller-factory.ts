import { LogMongoRepository, PostMongoRepository } from '@/infra/db/mongodb'
import { AddPostController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddPostValidation } from '@/main/factories'
import { LogControllerDecorator } from '@/main/decorators'
import { DbAddPost } from '@/data/usecases'

export const makeAddPostController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const dbAddPost = new DbAddPost(postMongoRepository)
  const addPostController = new AddPostController(makeAddPostValidation(), dbAddPost)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addPostController, logMongoRepository)
}
