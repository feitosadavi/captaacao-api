
import { Collection, InsertOneWriteOpResult, ObjectId } from 'mongodb'
import request from 'supertest'
import { sign } from 'jsonwebtoken'

import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

import { Express } from 'express'

import fs from 'fs'

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

  const insertPost = async (postedBy: string): Promise<InsertOneWriteOpResult<any>> => {
    return postsCollection.insertOne({
      title: 'any_title',
      description: 'any_description',
      postedBy: new ObjectId(postedBy),
      photos: ['photo1.jpg', 'photo2.jpg']
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

  // const makePhotos = (): String => JSON.stringify([{
  //   fileName: 'any_file_1_name',
  //   buffer: Buffer.from(''),
  //   mimeType: 'any_mime_type'
  // }, {
  //   fileName: 'any_file_2_name',
  //   buffer: Buffer.from(''),
  //   mimeType: 'any_mime_type'
  //   // eslint-disable-next-line @typescript-eslint/indent
  //   }])

  const mockData = (): any => ({
    title: 'any_title',
    description: 'any_description',
    photos: ['test_img-1_post', 'test_img-2_post'],
    price: 999999,
    fipePrice: 111111,
    brand: 'any_brand',
    model: 'any_model',
    year: 'any_year',
    color: 'any_color',
    doors: 4,
    steering: 'any_steering',
    fuel: 'any_fuel',
    kmTraveled: 100000,
    carItems: [
      'airbag',
      'alarme',
      'ar quente',
      'teto solar'
    ],
    licensePlate: 'any_license',
    fastSale: true
  })

  describe('POST /post', () => {
    test('Should return 403 on add post without accessToken ', async () => {
      await request(app)
        .post('/api/post')
        .field('data', JSON.stringify(mockData()))
        .attach('photos', file, { filename: 'test_img-1_post' })
        .attach('photos', file, { filename: 'test_img_2_post' })
        .set('Content-Type', 'multipart/form-data')
        .expect(403)
    })

    test('Should return 204 on add post success ', async () => {
      const inserteAccount = await insertAccount()
      const id = inserteAccount.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      const res = await request(app)
        .post('/api/post')
        .set('x-access-token', accessToken) // na requisição, eu coloco o accessToken nos headers
        .field('data', JSON.stringify(mockData()))
        .attach('photos', file, { filename: 'test_img-1_post' })
        .attach('photos', file, { filename: 'test_img_2_post' })
        .set('Content-Type', 'multipart/form-data')
      expect(res.body).toEqual({})
      expect(res.status).toBe(204)
    })
  })

  describe('POST /update-post/:id', () => {
    test('Should return 403 on add post without accessToken ', async () => {
      const accountId = (await insertAccount()).ops[0]._id
      const postId = (await insertPost(accountId)).ops[0]._id

      await request(app)
        .post(`/api/update-post/${postId}`)
        .field('data', JSON.stringify(mockData()))
        .attach('photos', file, { filename: 'test_img-1_post' })
        .attach('photos', file, { filename: 'test_img_2_post' })
        .set('Content-Type', 'multipart/form-data')
        .expect(403)
    })

    test('Should return 204 on add post success ', async () => {
      const inserteAccount = await insertAccount()
      const id = inserteAccount.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      const insertedPost = await insertPost(id)
      const res = await request(app)
        .post(`/api/update-post/${insertedPost.ops[0]._id}`)
        .set('x-access-token', accessToken) // na requisição, eu coloco o accessToken nos headers
        .field('data', JSON.stringify({ title: 'other_title' }))
        .attach('photos', file, { filename: 'test_img_1_post' })
        .attach('photos', file, { filename: 'test_img_2_post' })
        .set('Content-Type', 'multipart/form-data')
      expect(res.body).toEqual({ ok: true })
      expect(res.status).toBe(200)

      const post = await postsCollection.findOne({ id: (insertedPost.ops as any)._id })
      expect(post.photos).toEqual(['test_img_1_post', 'test_img_2_post'])
      expect(post.title).toBe('other_title')
    })
  })
})
