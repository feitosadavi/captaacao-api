import { DbLoadAllPosts } from '@/data/usecases'
import { PostMongoRepository } from '@/infra/db/mongodb'
import { LoadAllPostsController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadAllPostsController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const dbLoadAllPosts = new DbLoadAllPosts(postMongoRepository, postMongoRepository)
  return new LoadAllPostsController(dbLoadAllPosts)
}
