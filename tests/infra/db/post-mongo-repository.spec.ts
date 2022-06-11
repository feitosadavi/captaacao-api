import { Collection, ObjectID } from 'mongodb'

import { MongoHelper, PostMongoRepository } from '@/infra/db/mongodb'

import { mockPostsParams } from '@tests/domain/mocks'
import { mockPostsRepositoryParams } from '@tests/data/mocks'

describe('PostMongoRepository', () => {
  let postsCollection: Collection
  let accountsCollection: Collection

  // antes e depois de cada teste de integração, precisamos conectar e desconectar do banco
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
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
      const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      await postsCollection.insertMany([
        { ...mockPostsRepositoryParams()[0], postedBy: accountId },
        { ...mockPostsRepositoryParams()[1], postedBy: accountId }
      ])
      const posts = await sut.loadAll({})
      expect(posts.length).toBe(2)
      expect(posts[0].title).toBe('any_title')
      expect(posts[1].title).toBe('other_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[1].postedBy.name).toBe('any_name')
    })

    test('Should load all posts given the filter', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      const res = await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ postedBy: res.ops[0].postedBy })
      expect(posts.length).toBe(1)
      expect(posts[0].title).toBe('any_title')
    })

    test('Should load all posts given brand filter', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      const res = await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ brand: [res.ops[0].carBeingSold.brand, 'Fusca'] })
      expect(posts.length).toBe(1)
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should load all posts given color filter', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      const res = await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ color: [res.ops[0].carBeingSold.color, 'Roxo'] })
      expect(posts.length).toBe(1)
      expect(posts[0].carBeingSold.color).toBe('any_color')
    })

    test('Should load all posts given steering filter', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      const res = await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ steering: [res.ops[0].carBeingSold.steering, 'Elétrica'] })
      expect(posts.length).toBe(1)
      expect(posts[0].carBeingSold.steering).toBe('any_steering')
    })

    test('Should load all posts given year filter', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      const res = await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ year: [res.ops[0].carBeingSold.year, '2000'] })
      expect(posts.length).toBe(1)
      expect(posts[0].carBeingSold.year).toBe('any_year')
    })

    test('Should load all posts given doors filter', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      const res = await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ doors: [res.ops[0].carBeingSold.doors] })
      expect(posts.length).toBe(1)
      expect(posts[0].carBeingSold.doors).toBe(res.ops[0].carBeingSold.doors)
    })

    test('Should skip posts if skip parameter was given', async () => {
      const sut = makeSut()
      const { postedBy, ...post } = mockPostsParams()[0]
      await postsCollection.insertMany([
        { postedBy: new ObjectID(), ...post },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({ skip: 1 })
      expect(posts.length).toBe(1)
      expect(posts[0].title).toBe('other_title')
    })

    test('Should load empty list if collection has no posts', async () => {
      const sut = makeSut()
      const posts = await sut.loadAll({})
      expect(posts.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return a post on success', async () => {
      const accountId = (await accountsCollection.insertOne({ name: 'any_name' })).insertedId
      const res = await postsCollection.insertOne({ ...mockPostsRepositoryParams()[0], postedBy: accountId })
      const sut = makeSut()
      const post = await sut.loadById(res.ops[0]._id)
      expect(post).toBeTruthy()
      expect(post.id).toBeTruthy()
      expect(post.postedBy.name).toBe('any_name')
    })
  })

  describe('updateAccount()', () => {
    test('Should update the post fields on updatePost success', async () => {
      const sut = makeSut()

      const res = await postsCollection.insertOne({
        ...mockPostsParams()[0]
      })
      const fakePost = res.ops[0]
      const result = await sut.updatePost({ id: fakePost._id, fields: { title: 'other_title', description: 'other_description' } })
      expect(result).toBe(true)
      const post = await postsCollection.findOne({ _id: fakePost._id })

      expect(post).toBeTruthy()
      expect(post.title).toBe('other_title')
      expect(post.description).toBe('other_description')
    })
  })

  describe('deletePost()', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()

      const res = await postsCollection.insertOne(mockPostsParams()[0])
      const id = res.ops[0]._id

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
