import { LogMongoRepository, PostMongoRepository } from '@/infra/db/mongodb'
import { UpdatePostController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeUpdatePostValidation } from '@/main/factories'
import { LogControllerDecorator } from '@/main/decorators'
import { DbUpdatePost } from '@/data/usecases'
import { AwsS3FileStorage } from '@/infra/gateways'
import env from '@/main/config/env'

export const makeUpdatePostController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const awsS3FileStorage = new AwsS3FileStorage(
    env.s3.accessKey,
    env.s3.secret,
    env.s3.bucket
  )
  const dbUpdatePost = new DbUpdatePost(postMongoRepository, postMongoRepository, awsS3FileStorage, awsS3FileStorage)
  const updatePostController = new UpdatePostController(makeUpdatePostValidation(), dbUpdatePost)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(updatePostController, logMongoRepository)
}
