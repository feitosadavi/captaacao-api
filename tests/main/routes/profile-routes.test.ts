import { Collection, InsertOneWriteOpResult } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import app from '@/main/config/app'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb'

import { mockProfileParams } from '@tests/domain/mocks'

let profileCollection: Collection
let accountsCollection: Collection

describe('Profile Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    profileCollection = await MongoHelper.getCollection('profiles')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await profileCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  const insertAccount = async (): Promise<InsertOneWriteOpResult<any>> => {
    return accountsCollection.insertOne({
      name: 'any_account_name',
      email: 'mail@email.com',
      password: '123',
      role: 'admin'
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

  describe('POST /profile', () => {
    test('Should return 403 on post without accessToken ', async () => {
      await request(app)
        .post('/api/profile')
        .send(mockProfileParams())
        .send({ name: 'any_name' })
        .expect(403)
    })

    test('Should return 400 if correct params were not sent ', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)
      await request(app)
        .post('/api/profile')
        .set('x-access-token', accessToken)
        .expect(400)
    })

    test('Should return 204 on success ', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)
      await request(app)
        .post('/api/profile')
        .set('x-access-token', accessToken)
        .send({ name: 'any_name' })
        .expect(204)
    })
  })

  describe('GET /profiles', () => {
    test('Should return 204 if profiles collection is empty', async () => {
      await request(app)
        .get('/api/profiles/all')
        .send()
        .expect(204)
    })

    test('Should return 200 on success', async () => {
      await profileCollection.insertMany([mockProfileParams()])
      console.log(await profileCollection.find({}).toArray())
      await request(app)
        .get('/api/profiles/all')
        .send()
        .expect(200)
    })
  })

  describe('DELETE /profile/delete/:id', () => {
    test('should return 403 if user has no authorization', async () => {
      await request(app)
        .delete('/api/profile/delete/:id')
        .query({ id: 'any_id' })
        .expect(403)
    })

    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .delete('/api/profile/delete/:id')
        .set('x-access-token', accessToken)
        .query({ id })
        .expect(200)
    })
  })
})
