import { LogMongoRepository, PostMongoRepository } from '@/infra/db/mongodb'
import { AddPostController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddPostValidation } from '@/main/factories'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeAddPostController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const addPostController = new AddPostController(makeAddPostValidation(), postMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addPostController, logMongoRepository)
}
