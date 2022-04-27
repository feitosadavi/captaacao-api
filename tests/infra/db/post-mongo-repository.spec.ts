import { Collection } from 'mongodb'

import { MongoHelper, PostMongoRepository } from '@/infra/db/mongodb'

import { mockPostsParams } from '@tests/domain/mocks'
import { mockPostsRepositoryParams } from '@tests/data/mocks'

describe('PostMongoRepository', () => {
  let postsCollection: Collection

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
    await postsCollection.deleteMany({})
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
    test('Should load all posts on load success', async () => {
      const sut = makeSut()
      await postsCollection.insertMany([
        { ...mockPostsParams()[0] },
        { ...mockPostsParams()[1] }
      ])
      const posts = await sut.loadAll({})
      expect(posts.length).toBe(2)
      expect(posts[0].title).toBe('any_title')
      expect(posts[1].title).toBe('other_title')
    })

    test('Should load all posts given the filter', async () => {
      const sut = makeSut()
      const res = await postsCollection.insertMany([
        { ...mockPostsParams()[0] },
        { ...mockPostsParams()[1] }
      ])
      console.log(res)
      const posts = await sut.loadAll({ postedBy: res.ops[0].postedBy })
      expect(posts.length).toBe(1)
      expect(posts[0].title).toBe('any_title')
    })

    test('Should load empty list if collection has no posts', async () => {
      const sut = makeSut()
      const posts = await sut.loadAll({})
      expect(posts.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return a post on success', async () => {
      const res = await postsCollection.insertOne({ ...mockPostsParams()[0] })
      const sut = makeSut()
      const post = await sut.loadById(res.ops[0]._id)
      expect(post).toBeTruthy()
      expect(post.id).toBeTruthy()
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
