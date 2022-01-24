import { Collection, InsertOneWriteOpResult } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '@/infra/db/mongodb'
import app from '@/main/config/app'
import env from '@/main/config/env'

import { mockCarsParams } from '@tests/domain/mocks'

let carsCollection: Collection
let accountsCollection: Collection

describe('Car Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    carsCollection = await MongoHelper.getCollection('cars')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await carsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  const insertAccount = async (): Promise<InsertOneWriteOpResult<any>> => {
    return accountsCollection.insertOne({
      name: 'Carlos',
      email: 'carlos@gmail.com',
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

  // const insertCar = async (): Promise<InsertOneWriteOpResult<any>> => {
  //   return carsCollection.insertOne({
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

  describe('POST /cars', () => {
    test('Should return 403 on add car without accessToken ', async () => {
      await request(app)
        .post('/api/cars')
        .send(mockCarsParams())
        .expect(403)
    })

    test('Should return 204 on add car success ', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)
      await request(app)
        .post('/api/cars')
        .set('x-access-token', accessToken) // na requisição, eu coloco o accessToken nos headers
        .send(mockCarsParams()[0])
        .expect(204)
    })
  })

  describe('GET /cars/:id', () => {
    test('Should return 204 if no car was found', async () => {
      await request(app)
        .get('/api/cars')
        .query({ id: 'any_car_id' })
        .send()
        .expect(204)
    })

    test('Should return 200 on load car by id success', async () => {
      await carsCollection.insertOne({ ...mockCarsParams()[0] })
      await request(app)
        .get('/api/cars')
        .query({ id: 'any_car_id' })
        .send()
        .expect(200)
    })
  })

  describe('GET /cars', () => {
    test('Should return 204 if cars collection is empty', async () => {
      await request(app)
        .get('/api/cars')
        .send()
        .expect(204)
    })

    test('Should return 200 on load car success', async () => {
      await carsCollection.insertMany([
        { ...mockCarsParams()[0] },
        { ...mockCarsParams()[1] }
      ])
      await request(app)
        .get('/api/cars')
        .send()
        .expect(200)
    })

    test('Should return 204 if no car was found', async () => {
      await request(app)
        .get('/api/cars')
        .query({ id: 'any_car_id' })
        .send()
        .expect(204)
    })

    test('Should return 200 on load car by id success', async () => {
      await carsCollection.insertOne({ ...mockCarsParams()[0] })
      await request(app)
        .get('/api/cars')
        .query({ id: 'any_car_id' })
        .send()
        .expect(200)
    })
  })

  // describe('PUT /cars/:carId/results', () => {
  //   test('should 200 on save car success', async () => {
  //     const resAccount = await insertAccount()
  //     const resCar = await insertCar()

  //     const accountId = resAccount.ops[0]._id
  //     const accessToken = sign({ accountId }, env.secret)

  //     await updateAccountToken(accountId, accessToken)
  //     await request(app)
  //       .put(`/api/cars/${resCar.ops[0]._id}/results`)
  //       .set('x-access-token', accessToken)
  //       .send({
  //         answer: 'papagaio'
  //       })
  //       .expect(200)
  //   })
  // })
})
