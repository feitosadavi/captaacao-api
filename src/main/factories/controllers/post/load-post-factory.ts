import { DbLoadAllPosts } from '@/data/usecases'
import { PostMongoRepository } from '@/infra/db/mongodb'
import { LoadAllPostsController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadPostController = (): Controller => {
  const postMongoRepository = new PostMongoRepository()
  const dbLoadAllPosts = new DbLoadAllPosts(postMongoRepository)
  return new LoadAllPostsController(dbLoadAllPosts)
}
