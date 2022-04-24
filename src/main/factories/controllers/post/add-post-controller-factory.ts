import { LogMongoRepository, PostMongoRepository } from '@/infra/db/mongodb'
import { AddPostController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeAddPostValidation } from '@/main/factories'
import { LogControllerDecorator } from '@/main/decorators'
import { DbAddPost } from '@/data/usecases'
import { AwsS3FileStorage } from '@/infra/gateways'
import env from '@/main/config/env'

export const makeAddPostController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const awsS3FileStorage = new AwsS3FileStorage(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
  const dbAddPost = new DbAddPost(postMongoRepository, awsS3FileStorage)
  const addPostController = new AddPostController(makeAddPostValidation(), dbAddPost)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addPostController, logMongoRepository)
}
