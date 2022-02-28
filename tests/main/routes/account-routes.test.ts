import { Collection, InsertOneWriteOpResult } from 'mongodb'
import request from 'supertest'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'
import { Express } from 'express'

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

describe('Account Routes', () => {
  let app: Express
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    app = await setupApp()
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

  describe('POST /password-recover', () => {
    test('Should return 200 on success', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Captação',
        email: 'captacaodevtesting2@gmail.com',
        password
      })
      await request(app)
        .post('/api/account/password-recover')
        .send({ email: 'captacaodevtesting2@gmail.com' })
        .expect(200)
    })
    test('Should return in case of no email has been sent', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Captação',
        email: 'captacaodevtesting2@gmail.com',
        password
      })
      await request(app)
        .post('/api/account/password-recover')
        .send()
        .expect(400)
    })
    test('Should return 400 if email is invalid', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Captação',
        email: 'captacaodevtesting2@gmail.com',
        password
      })
      await request(app)
        .post('/api/account/password-recover')
        .send({ email: 'captacaodevtesting2gmail.com' })
        .expect(400)
    })
  })
  describe('POST /check-code', () => {
    test('Should return 200 on success', async () => {
      const password = await hash('123', 12)
      const createdAt = new Date()
      await accountsCollection.insertOne({
        email: 'captacaodevtesting2@gmail.com',
        password,
        code: {
          number: 123456,
          createdAt,
          expiresAt: createdAt.setMinutes(createdAt.getMinutes() + 5)
        }
      })
      await request(app)
        .post('/api/account/check-code')
        .send({ code: 123456 })
        .expect(200)
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

  describe('PUT /account/update', () => {
    test('should return 403 if user has no authorization', async () => {
      await request(app)
        .put('/api/account/update')
        .expect(403)
    })
    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .put('/api/account/update')
        .set('x-access-token', accessToken)
        .send({ name: 'Davi', nickname: 'davizio' })
        .expect(400)
    })
  })

  describe('PUT /account/update-password', () => {
    test('should return 400 if password have not been sent', async () => {
      await request(app)
        .put('/api/account/update-password/:id')
        .query({ id: 'any_id' })
        .expect(400)
    })
    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .put('/api/account/update-password/:id')
        .query({ id })
        .send({ password: 'any_password' })
        .expect(200)
    })
  })

  describe('DELETE /accounts/delete/:id', () => {
    test('should return 403 if user has no authorization', async () => {
      await request(app)
        .delete('/api/accounts/delete/any_id')
        .expect(403)
    })

    test('should return 200 on success', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      await request(app)
        .delete(`/api/accounts/delete/${id}`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
