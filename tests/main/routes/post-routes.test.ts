import { Collection, InsertOneWriteOpResult } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

import { mockPostsParams } from '@tests/domain/mocks'
import { Express } from 'express'

let postsCollection: Collection
let accountsCollection: Collection

describe('Post Routes', () => {
  let app: Express
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    app = await setupApp()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    postsCollection = await MongoHelper.getCollection('posts')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await postsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  const insertAccount = async (): Promise<InsertOneWriteOpResult<any>> => {
    return accountsCollection.insertOne({
      name: 'Postlos',
      email: 'postlos@gmail.com',
      password: '123',
      profiles: ['admin']
    })
  }

  const updateAccountToken = async (id: string, accessToken: string): Promise<void> => {
    await accountsCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
  }

  // const insertPost = async (): Promise<InsertOneWriteOpResult<any>> => {
  //   return postsCollection.insertOne({
  //     name: 'Panamera',
  //     price: 400000,
  //     brand: 'Porsche',
  //     year: '2021',
  //     color: 'vermelho',
  //     vehicleItems: [
  //       'Vidro automático',
  //       'Roda liga leve'
  //     ],
  //     addDate: new Date()
  //   })
  // }

  describe('POST /posts', () => {
    test('Should return 403 on add post without accessToken ', async () => {
      await request(app)
        .post('/api/posts')
        .send(mockPostsParams())
        .expect(403)
    })

    test('Should return 204 on add post success ', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      const { status, createdAt, modifiedAt, views, ...requestParams } = mockPostsParams()[0]
      await updateAccountToken(id, accessToken)
      await request(app)
        .post('/api/posts')
        .set('x-access-token', accessToken) // na requisição, eu coloco o accessToken nos headers
        .send(requestParams)
        .expect(204)
    })
  })

  describe('GET /posts/:id', () => {
    test('Should return 204 if no post was found', async () => {
      await request(app)
        .get('/api/posts/:id')
        .query({ id: 'any_id' })
        .send()
        .expect(500)
    })

    test('Should return 200 on load post by id success', async () => {
      const res = await postsCollection.insertOne({ ...mockPostsParams()[0] })
      await request(app)
        .get(`/api/posts/${res.insertedId}`)
        .send()
        .expect(200)
    })
  })

  describe('GET /posts/all', () => {
    test('Should return 204 if posts collection is empty', async () => {
      await request(app)
        .get('/api/posts/all')
        .send()
        .expect(204)
    })

    test('Should return 200 on load post success', async () => {
      await postsCollection.insertMany([
        { ...mockPostsParams()[0] },
        { ...mockPostsParams()[1] }
      ])
      await request(app)
        .get('/api/posts/all')
        .send()
        .expect(200)
    })
  })

  // describe('PUT /posts/:postId/results', () => {
  //   test('should 200 on save post success', async () => {
  //     const resAccount = await insertAccount()
  //     const resPost = await insertPost()

  //     const accountId = resAccount.ops[0]._id
  //     const accessToken = sign({ accountId }, env.secret)

  //     await updateAccountToken(accountId, accessToken)
  //     await request(app)
  //       .put(`/api/posts/${resPost.ops[0]._id}/results`)
  //       .set('x-access-token', accessToken)
  //       .send({
  //         answer: 'papagaio'
  //       })
  //       .expect(200)
  //   })
  // })
})
