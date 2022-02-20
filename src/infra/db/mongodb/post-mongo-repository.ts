import { AddPostRepository, LoadPostByIdRepository, LoadPostsRepository } from '@/data/protocols'
import { PostModel } from '@/domain/models/post'
import { AddPostParams } from '@/domain/usecases'
import { ObjectID } from 'mongodb'
import { MongoHelper } from './mongo-helper'

export class PostMongoRepository implements AddPostRepository, LoadPostsRepository, LoadPostByIdRepository {
  async add (postData: AddPostParams): Promise<void> {
    const postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.insertOne(postData)
  }

  async loadAll (): Promise<PostModel[]> {
    const postsCollection = await MongoHelper.getCollection('posts')
    const posts = await postsCollection.find().toArray()
    return posts && MongoHelper.mapCollection(posts)
  }

  async loadById (id: string): Promise<PostModel> {
    const postsCollection = await MongoHelper.getCollection('posts')
    const post = await postsCollection.findOne({ _id: new ObjectID(id) })
    return post && MongoHelper.map(post)
  }
}
