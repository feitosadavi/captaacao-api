import { Collection, InsertOneWriteOpResult } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let accountsCollection: Collection

const insertAccount = async (): Promise<InsertOneWriteOpResult<any>> => {
  return accountsCollection.insertOne({
    name: 'Anderson Moreira Santos',
    email: 'andersantos@gmail.com',
    password: '789456123',
    cpf: '58978963252',
    birthDate: '05/10/1970',
    phoneNumber: '5563982266580',
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

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Anderson Moreira Santos',
          email: 'andersantos@gmail.com',
          password: '789456123',
          passwordConfirmation: '789456123',
          cpf: '58978963252',
          birthDate: '05/10/1970',
          phoneNumber: '5563982266580',
          role: 'admin'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Davi',
        email: 'davifeitosa.dev@protonmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'davifeitosa.dev@protonmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 if login is unauthorized', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'davifeitosa.dev@gmail.com',
          password: '123456'
        })
        .expect(401)
    })
  })

  describe('GET /accounts', () => {
    test('should return 403 if user has no authorization', async () => {
      await request(app)
        .get('/api/accounts')
        .expect(403)
    })
    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .get('/api/accounts')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })

  describe('GET /accounts/:id', () => {
    test('should return 403 if user has no authorization', async () => {
      await request(app)
        .get('/api/accounts/:id')
        .query({ id: 'any_id' })
        .expect(403)
    })
    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .get('/api/accounts/:id')
        .set('x-access-token', accessToken)
        .query({ id: 'any_id' })
        .expect(200)
    })
  })

  describe('DELETE /accounts/delete/:id', () => {
    test('should return 403 if user has no authorization', async () => {
      await request(app)
        .delete('/api/accounts/delete/:id')
        .query({ id: 'any_id' })
        .expect(403)
    })

    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .delete('/api/accounts/delete/:id')
        .set('x-access-token', accessToken)
        .query({ id: 'any_id' })
        .expect(200)
    })
  })
})
