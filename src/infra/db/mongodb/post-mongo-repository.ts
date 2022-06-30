/* eslint-disable no-dupe-keys */
import { ObjectId } from 'mongodb'

import { AddPostRepository, LoadPostByIdRepository, LoadAllPostsRepository, DeletePostRepository, UpdatePostRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb'
import { DeletePost } from '@/domain/usecases'

export class PostMongoRepository implements AddPostRepository, LoadAllPostsRepository, LoadPostByIdRepository, UpdatePostRepository, DeletePostRepository {
  async addPost (params: AddPostRepository.Params): AddPostRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.insertOne(params)
  }

  async loadAll (params: LoadAllPostsRepository.Params): Promise<LoadAllPostsRepository.Result> {
    const postsCollection = await MongoHelper.getCollection('posts')
    // postedBy is an ID, so we need to convert it so that it can be used in find
    const { skip, limit, count, postedBy, search, ...filters } = params
    // const posts = await postsCollection.aggregate([
    //   {
    //     $match: { ...query }
    //   }
    // ]).skip(skip ?? 0).limit(limit || 9999999999999).toArray()

    const stages: any = [
      {
        $facet: {
          sold: [
            { $match: { 'carBeingSold.sold': true } }, { $count: 'sold' }
          ],
          notSold: [
            { $match: { 'carBeingSold.sold': false } }, { $count: 'notSold' }
          ],
          data: [
            {
              $lookup: {
                from: 'accounts',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy'
              }
            },
            {
              $addFields: {
                postedBy: { $arrayElemAt: ['$postedBy', 0] }
              }
            },
            { $skip: skip || 0 },
            { $limit: limit || 999999999 }
          ]
        }
      }
    ]

    const andQuery = []
    if (Object.keys(filters).length !== 0) {
      for (const key of Object.keys(filters)) {
        const orQuery = { $or: [] }
        const filterOption = filters[key].map((value: string) => ({ [`carBeingSold.${key}`]: value }))
        orQuery.$or.push(...filterOption)
        andQuery.push(orQuery)
      }
    }
    if (search) andQuery.push({ $text: { $search: search } })
    const query = andQuery.length > 0 ? { $and: andQuery } : {}

    if (postedBy) {
      stages.unshift({ $match: { postedBy: new ObjectId(postedBy), ...query } })
    }

    const posts = (await postsCollection.aggregate(stages).toArray())[0]
    const countValues = { sold: posts.sold[0]?.sold || 0, notSold: posts.notSold[0]?.notSold || 0 }
    const mappedPostedBy = posts.data.map(post => { post.postedBy = MongoHelper.map(post.postedBy); return post })
    const result: LoadAllPostsRepository.Result = { result: MongoHelper.mapCollection(mappedPostedBy), count: countValues }
    return result
  }

  async loadById ({ id }: LoadPostByIdRepository.Params): LoadPostByIdRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    // const post = await postsCollection.findOne({ _id: new ObjectId(id) })
    const post = await postsCollection.aggregate([
      {
        $match: { $expr: { $eq: ['$_id', new ObjectId(id)] } }
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy'
        }
      },
      {
        $addFields: {
          postedBy: { $arrayElemAt: ['$postedBy', 0] }
        }
      }
    ]).toArray()
    const postedBy = MongoHelper.map(post[0].postedBy)
    return post[0] && MongoHelper.map({ ...post[0], postedBy })
  }

  async updatePost (params: UpdatePostRepository.Params): UpdatePostRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    const { id, fields } = params
    const res = await postsCollection.updateOne({ _id: new ObjectId(id) },
      {
        $set: fields
      }
    )
    return res.modifiedCount > 0
  }

  async deletePost ({ id }: DeletePost.Params): DeletePost.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }
}
