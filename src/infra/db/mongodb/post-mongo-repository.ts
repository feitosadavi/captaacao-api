import { ObjectID } from 'mongodb'

import { AddPostRepository, LoadPostByIdRepository, LoadAllPostsRepository, DeletePostRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb'
import { DeletePost } from '@/domain/usecases'

export class PostMongoRepository implements AddPostRepository, LoadAllPostsRepository, LoadPostByIdRepository, DeletePostRepository {
  async addPost (params: AddPostRepository.Params): AddPostRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.insertOne(params)
  }

  async loadAll (params: LoadAllPostsRepository.Params): LoadAllPostsRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')

    // postedBy is an ID, so we need to convert it so that it can be used in find
    const { skip, ...filters } = params
    if (filters.postedBy) (filters as any).postedBy = new ObjectID(filters.postedBy)

    const posts = await postsCollection.find(filters).skip(skip ?? 0).toArray()
    return posts && MongoHelper.mapCollection(posts)
  }

  async loadById ({ id }: LoadPostByIdRepository.Params): LoadPostByIdRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    const post = await postsCollection.findOne({ _id: new ObjectID(id) })
    return post && MongoHelper.map(post)
  }

  async deletePost ({ id }: DeletePost.Params): DeletePost.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    const result = await postsCollection.deleteOne({ _id: id })
    return result.deletedCount === 1
  }
}
