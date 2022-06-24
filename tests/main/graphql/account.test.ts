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
    favouritePosts: ['any_post_id'],
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

describe('AddFavouritePost Mutation', () => {
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

  const makeQuery = (): string => `mutation {
    addFavouritePost (
      favouritePostId: "other_post_id"
    ) {
      ok
    }
  }`

  test('Should return 403 on request without authentication', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({ query: makeQuery() })
    expect(res.status).toBe(403)
  })

  test('Should return 200 on success', async () => {
    const insertAccountResult = await insertAccount()
    const accountId = insertAccountResult.ops[0]._id
    const accessToken = sign({ id: accountId }, env.secret)
    await updateAccountToken(accountId, accessToken)

    const res = await request(app)
      .post('/graphql')
      .set('x-access-token', accessToken)
      .send({ query: makeQuery() })
    expect(res.status).toBe(200)
    expect(res.body.data.addFavouritePost.ok).toBe(true)
    const account = await accountsCollection.findOne({ _id: accountId })
    console.log({ account })
    expect(account.favouritePosts).toEqual(['any_post_id', 'other_post_id'])
  })
})
