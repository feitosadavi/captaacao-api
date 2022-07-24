/* eslint-disable no-dupe-keys */
import { ObjectId } from 'mongodb'

import { AddPostRepository, LoadPostByIdRepository, LoadAllPostsRepository, DeletePostRepository, UpdatePostRepository, LoadRawFilterOptions } from '@/data/protocols'
import { MongoHelper } from '@/infra/db/mongodb'
import { DeletePost } from '@/domain/usecases'

export class PostMongoRepository implements AddPostRepository,
  LoadAllPostsRepository,
  LoadRawFilterOptions,
  LoadPostByIdRepository,
  UpdatePostRepository,
  DeletePostRepository {
  async addPost (params: AddPostRepository.Params): AddPostRepository.Result {
    const postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.insertOne(params)
  }

  async loadRaw (): Promise<LoadRawFilterOptions.Result> {
    const postsCollection = await MongoHelper.getCollection('posts')
    const cars = await postsCollection.find({},
      {
        // @ts-ignore
        'carBeingSold.brand': 1,
        'carBeingSold.year': 1,
        'carBeingSold.steering': 1,
        'carBeingSold.fuel': 1,
        'carBeingSold.color': 1,
        'carBeingSold.doors': 1
      }
    ).toArray()
    const filterNames: Array<'brand' | 'fuel' | 'year' | 'color' | 'steering' | 'doors'> = [
      'brand',
      'fuel',
      'year',
      'color',
      'steering',
      'doors'
    ]
    const filterOptions: any = {}
    for (const filterName of filterNames) {
      filterOptions[filterName] = []
      for (const car of cars) {
        if (!filterOptions[filterName]?.includes(car.carBeingSold[filterName])) {
          filterOptions[filterName].push(car.carBeingSold[filterName])
        }
      }
    }
    return filterOptions
  }

  async loadAll (params: LoadAllPostsRepository.Params): Promise<LoadAllPostsRepository.Result> {
    const postsCollection = await MongoHelper.getCollection('posts')
    // postedBy is an ID so, we need to convert it so that it can be used in find
    const { skip, limit, count, postedBy, search, year, ...filters } = params
    console.log({ search })
    // SETUP FILTERS
    const and = []
    const keys = Object.keys(filters)
    if (keys.length !== 0) {
      for (const key of keys) {
        // make the comparations query based on filters key and value
        const comparassion = { [`carBeingSold.${key}`]: { $in: filters[key] } }
        and.push(comparassion)
      }
    } else {
      // and query will be an empty obj arr if no filters were settled
      and.push({})
    }

    if (postedBy) and.push({ postedBy: new ObjectId(postedBy) })
    if (search) and.push({ $text: { $search: search } })
    if (year?.length > 0) and.push({ 'carBeingSold.year': { $gte: year[0], $lte: year[1] ?? 9999 } })

    const aggregation = [
      { $match: { $and: and } },
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
            { $limit: limit || 99999999999 }
          ]
        }
      }
    ]

    const posts = (await postsCollection.aggregate(aggregation).toArray())[0]
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
