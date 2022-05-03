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
    console.log(params)
    // postedBy is an ID, so we need to convert it so that it can be used in find
    const { skip, postedBy, ...filters } = params

    const andQuery = []
    for (const key of Object.keys(filters)) {
      const orQuery = { $or: [] }
      const filterOption = filters[key].map((value: string) => ({ [`carBeingSold.${key}`]: value }))
      orQuery.$or.push(...filterOption)
      andQuery.push(orQuery)
    }
    if (postedBy) andQuery.push({ postedBy: new ObjectID(postedBy) })

    const query = andQuery.length > 0 ? { $and: andQuery } : {}
    const posts = await postsCollection.find(query).skip(skip ?? 0).toArray()
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
