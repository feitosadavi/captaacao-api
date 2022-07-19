import { Collection, ObjectId } from 'mongodb'

import { MongoHelper, PostMongoRepository } from '@/infra/db/mongodb'

import { mockPostsParams } from '@tests/domain/mocks'
import { mockPostsRepositoryParams } from '@tests/data/mocks'
import { PostModel } from '@/domain/models'

type Identity<T> = { [P in keyof T]: T[P] }
type Replace<T, K extends keyof T, TReplace> = Identity<Pick<T, Exclude<keyof T, K>> & {
  [P in K]: TReplace
}>

describe('PostMongoRepository', () => {
  let postsCollection: Collection
  let accountsCollection: Collection

  // antes e depois de cada teste de integração, precisamos conectar e desconectar do banco
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    await MongoHelper.setupIndexes()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  // removo todos os registros da tabela antes de cada teste. Para não populuir as tabelas
  beforeEach(async () => {
    postsCollection = await MongoHelper.getCollection('posts')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await postsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  const makeSut = (): PostMongoRepository => {
    return new PostMongoRepository()
  }

  type InsertPostsAndReturnResult = Array<Omit<PostModel, 'id'> & { _id: string }>

  const insertPostsAndReturnResult = async (): Promise<InsertPostsAndReturnResult> => {
    const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
    await postsCollection.insertMany([
      { ...mockPostsRepositoryParams()[0], postedBy: accountId },
      { ...mockPostsRepositoryParams()[1], postedBy: accountId }
    ])

    const insertedPosts = await postsCollection.find().toArray()
    return insertedPosts as unknown as InsertPostsAndReturnResult
  }

  describe('add()', () => {
    test('Should create a post on add success', async () => {
      const sut = makeSut()
      await sut.addPost(mockPostsRepositoryParams()[0])
      const post = await postsCollection.findOne({ title: 'any_title' })
      expect(post).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all posts with none skip parameters has been passed', async () => {
      const sut = makeSut()
      await insertPostsAndReturnResult()
      const posts = await sut.loadAll({})
      expect(posts.result.length).toBe(2)
      expect(posts.result[0].title).toBe('any_title')
      expect(posts.result[1].title).toBe('other_title')
      expect(posts.result[0].postedBy.name).toBe('any_name')
      expect(posts.result[1].postedBy.name).toBe('any_name')
    })

    test('Should load all posts given the postedBy filter', async () => {
      const sut = makeSut()
      const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      await postsCollection.insertMany([
        { ...mockPostsRepositoryParams()[0], postedBy: new ObjectId() },
        { ...mockPostsRepositoryParams()[0], postedBy: new ObjectId(accountId) }
      ])
      const posts = await sut.loadAll({ postedBy: String(accountId) })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].title).toBe('any_title')
    })

    test('Should load all posts given brand filter', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ brand: [insertedPost.carBeingSold.brand, 'Fusca'] })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should load all posts given color filter', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ color: [insertedPost.carBeingSold.color, 'Roxo'] })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].carBeingSold.color).toBe('any_color')
    })

    test('Should load all posts given steering filter', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ steering: [insertedPost.carBeingSold.steering, 'Elétrica'] })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].carBeingSold.steering).toBe('any_steering')
    })

    test('Should load all posts given year filter', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ year: [2000, insertedPost.carBeingSold.year] })
      expect(posts.result.length).toBe(2)
      expect(posts.result[0].carBeingSold.year).toBe(insertedPost.carBeingSold.year)
    })

    test('Should load all posts given doors filter', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ doors: [Number(insertedPost.carBeingSold.doors)] })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].carBeingSold.doors).toBe(insertedPost.carBeingSold.doors)
    })

    test('Should load all posts given the searching by title', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ search: 'any_title' })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].carBeingSold.doors).toBe(insertedPost.carBeingSold.doors)
    })

    test('Should load all posts given the searching by description', async () => {
      const sut = makeSut()
      const insertedPost = (await insertPostsAndReturnResult())[0]
      const posts = await sut.loadAll({ search: 'any_description' })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].carBeingSold.doors).toBe(insertedPost.carBeingSold.doors)
    })

    test('Should skip posts if skip parameter was given', async () => {
      const sut = makeSut()
      await insertPostsAndReturnResult()
      const posts = await sut.loadAll({ skip: 1 })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].title).toBe('other_title')
    })

    test('Should return a number of posts given limit value', async () => {
      const sut = makeSut()
      await insertPostsAndReturnResult()
      const posts = await sut.loadAll({ limit: 1 })
      expect(posts.result.length).toBe(1)
      expect(posts.result[0].title).toBe('any_title')
    })

    test('Should return a number of posts given limit and skip value', async () => {
      const sut = makeSut()
      const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      const accountId2 = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      await postsCollection.insertMany([
        { ...mockPostsRepositoryParams()[0], postedBy: accountId }, // any_title
        { ...mockPostsRepositoryParams()[1], postedBy: accountId }, // other_title
        { ...mockPostsRepositoryParams()[1], postedBy: accountId2 } // other_title
      ])

      const posts = await sut.loadAll({ skip: 1, limit: 2 })
      expect(posts.result.length).toBe(2)
      expect(posts.result[0].title).toBe('other_title')
      expect(posts.result[1].title).toBe('other_title')
    })

    test('Should return return the count of sold and notSold posts', async () => {
      const sut = makeSut()
      const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      const soldCar = {
        carBeingSold: {
          ...mockPostsRepositoryParams()[0].carBeingSold,
          sold: true
        }
      }
      await postsCollection.insertMany([
        { ...mockPostsRepositoryParams()[0], postedBy: accountId, ...soldCar }, // any_title
        { ...mockPostsRepositoryParams()[1], postedBy: accountId }, // other_title
        { ...mockPostsRepositoryParams()[1], postedBy: accountId } // other_title
      ])

      const posts = await sut.loadAll({})
      expect(posts.count.sold).toBe(1)
      expect(posts.count.notSold).toBe(2)
      expect(posts.result.length).toBe(3)
      expect(posts.result[0].title).toBe('any_title')
      expect(posts.result[1].title).toBe('other_title')
    })

    test('Should load empty list if collection has no posts', async () => {
      const sut = makeSut()
      const posts = await sut.loadAll({})
      expect(posts.result.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return a post on success', async () => {
      const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      const insertedId = (await postsCollection.insertOne({ ...mockPostsRepositoryParams()[0], postedBy: accountId })).insertedId
      const sut = makeSut()
      const post = await sut.loadById({ id: String(insertedId) })
      expect(post).toBeTruthy()
      expect(post.id).toBeTruthy()
      expect(post.postedBy.name).toBe('any_name')
    })
  })

  describe('updateAccount()', () => {
    test('Should update the post fields on updatePost success', async () => {
      const sut = makeSut()
      const insertedPostId = (await insertPostsAndReturnResult())[0]._id
      const result = await sut.updatePost({ id: String(insertedPostId), fields: { title: 'other_title', description: 'other_description' } })
      expect(result).toBe(true)
      const post = await postsCollection.findOne({ _id: insertedPostId })
      expect(post).toBeTruthy()
      expect(post.title).toBe('other_title')
      expect(post.description).toBe('other_description')
    })
  })

  describe('deletePost()', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()
      const res = await postsCollection.insertOne(mockPostsParams()[0])
      const id = String(res.insertedId)
      const deletionResult = await sut.deletePost({ id })
      expect(deletionResult).toBe(true)
    })
    test('Should return false if post doesnt exists', async () => {
      const sut = makeSut()
      const deletionResult = await sut.deletePost({ id: '61539180dd2622353d5e11c8' })
      expect(deletionResult).toBe(false)
    })
  })
})
