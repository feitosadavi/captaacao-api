import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection, InsertOneWriteOpResult } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let accountsCollection: Collection
let postsCollection: Collection
let app: Express

const insertAccount = async (): Promise<InsertOneWriteOpResult<any>> => {
  return accountsCollection.insertOne({
    name: 'Teste',
    email: 'teste@gmail.com',
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

const insertPost = async (postedBy: string): Promise<InsertOneWriteOpResult<any>> => {
  return postsCollection.insertOne({
    title: 'teste',
    postedBy
  })
}

describe('Account GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    postsCollection = await MongoHelper.getCollection('posts')
    await postsCollection.deleteMany({})
  })

  describe('Delete Mutation', () => {
    const query = `mutation {
      delete (
        id: "any_id"
      ) {
        result
      }
    }`

    test('Should return 403 on request without authentication', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
    })

    test('Should return 200 on request without authentication', async () => {
      const insertAccountResult = await insertAccount()
      const accountId = insertAccountResult.ops[0]._id
      const accessToken = sign({ id: accountId }, env.secret)
      await updateAccountToken(accountId, accessToken)

      const insertPostResult = await insertPost(accountId)
      const postId = insertPostResult.insertedId

      const query = `mutation {
        delete (
          id: "${postId}"
        ) {
          result
        }
      }`

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      // console.log(res)
      expect(res.status).toBe(200)
    })
  })
})
