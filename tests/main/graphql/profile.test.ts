import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection, InsertOneWriteOpResult } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
import MockDate from 'mockdate'

let accountsCollection: Collection
let postsCollection: Collection
let app: Express

const insertProfile = async (date: Date): Promise<InsertOneWriteOpResult<any>> => {
  return postsCollection.insertOne({
    name: 'any_name',
    createdAt: date,
    modifiedAt: date
  })
}

describe('Profile GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
    postsCollection = await MongoHelper.getCollection('profiles')
    await postsCollection.deleteMany({})
  })

  describe('Accounts Query', () => {
    test('Should return accounts on success', async () => {
      const date = new Date()
      await insertProfile(date)
      const query = `query {
        profiles {
          id
          name
          createdAt
          modifiedAt
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { profiles } = res.body.data
      expect(profiles[0].id).toBeTruthy()
      expect(profiles[0].name).toBe('any_name')
      expect(profiles[0].createdAt).toBe(date.toISOString())
      expect(profiles[0].modifiedAt).toBe(date.toISOString())
    })
  })
})
