import { DbLoadPosts } from '@/data/usecases'
import { PostMongoRepository } from '@/infra/db/mongodb'
import { LoadPostsController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadPostController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const dbLoadPosts = new DbLoadPosts(postMongoRepository)
  return new LoadPostsController(dbLoadPosts)
}
