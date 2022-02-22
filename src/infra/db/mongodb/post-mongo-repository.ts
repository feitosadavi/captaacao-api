import { ObjectID } from 'mongodb'

import { AddPostRepository, LoadPostByIdRepository, LoadAllPostsRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb'

export class PostMongoRepository implements AddPostRepository, LoadAllPostsRepository, LoadPostByIdRepository {
  async addPost (params: AddPostRepository.Params): AddPostRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.insertOne(params)
  }

  async loadAll (): LoadAllPostsRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    const posts = await postsCollection.find().toArray()
    return posts && MongoHelper.mapCollection(posts)
  }

  async loadById ({ id }: LoadPostByIdRepository.Params): LoadPostByIdRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    const post = await postsCollection.findOne({ _id: new ObjectID(id) })
    return post && MongoHelper.map(post)
  }
}
