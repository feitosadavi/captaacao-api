
import { Collection, InsertOneWriteOpResult } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

import { Express } from 'express'

import fs from 'fs'
import { String } from 'aws-sdk/clients/appstream'

let postsCollection: Collection
let accountsCollection: Collection

describe('Post Routes', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let file: Buffer
  const fileName = 'img-post_test.png'
  const dir = './test_tmp'
  const path = `${dir}/${fileName}`

  let app: Express

  beforeAll(async () => {
    createFile()
    await MongoHelper.connect(process.env.MONGO_URL)
    app = await setupApp()
  })

  beforeEach(async () => {
    postsCollection = await MongoHelper.getCollection('posts')
    accountsCollection = await MongoHelper.getCollection('accounts')
    await postsCollection.deleteMany({})
    await accountsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  const createFile = (): void => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    fs.openSync(path, 'w')
    fs.writeFileSync(path, 'Olá mundo!')
    file = fs.readFileSync(path)
  }

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

  const makePhotos = (): String => JSON.stringify([{
    fileName: 'any_file_1_name',
    buffer: Buffer.from(''),
    mimeType: 'any_mime_type'
  }, {
    fileName: 'any_file_2_name',
    buffer: Buffer.from(''),
    mimeType: 'any_mime_type'
  }])
  const makeCarBeingSold = (): string => JSON.stringify({
    price: 999999,
    fipePrice: 111111,
    brand: 'any_brand',
    model: 'any_model',
    year: 'any_year',
    color: 'any_color',
    doors: 4,
    steering: 'any_steering',
    kmTraveled: 100000,
    carItems: [
      'airbag',
      'alarme',
      'ar quente',
      'teto solar'
    ],
    licensePlate: 'any_license',
    sold: false,
    fastSale: true
  })

  describe('POST /post', () => {
    test('Should return 403 on add post without accessToken ', async () => {
      await request(app)
        .post('/api/post')
        .field('title', 'any_title')
        .field('description', 'any_description')
        .field('photos', makePhotos())
        .field('carBeingSold', makeCarBeingSold())
        .attach('photos', file, { filename: 'test_img-1_post' })
        .attach('photos', file, { filename: 'test_img_2_post' })
        .expect(403)
    })

    test('Should return 204 on add post success ', async () => {
      const inserteAccount = await insertAccount()
      const id = inserteAccount.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)
      await request(app)
        .post('/api/post')
        .set('x-access-token', accessToken) // na requisição, eu coloco o accessToken nos headers
        .field('title', 'any_title')
        .field('description', 'any_description')
        .field('photos', makePhotos())
        .field('carBeingSold', makeCarBeingSold())
        .attach('photos', file, { filename: 'test_img-1_post.png' })
        .attach('photos', file, { filename: 'test_img_2_post.png' })
        .expect(204)
    })
  })
})
