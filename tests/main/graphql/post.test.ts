import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'

let accountCollection: Collection
let app: Express

describe('Account GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('posts')
    await accountCollection.deleteMany({})
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
  })
})
