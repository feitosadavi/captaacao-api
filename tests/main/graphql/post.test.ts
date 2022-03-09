import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection, InsertOneWriteOpResult } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { hash } from 'bcrypt'
import { mockAccountParams } from '@tests/domain/mocks'

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
    title: 'any_title',
    postedBy,
    carBeingSold: {
      brand: 'any_brand'
    }
  })
}

describe('Post GraphQL', () => {
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

  describe('Accounts Query', () => {
    test('Should return accounts on success', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(accountId)
      const query = `query {
        posts {
          id
          title
          postedBy
          carBeingSold {
            brand
          }
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts } = res.body.data
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy).toBe(accountId.toString())
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })
  })

  describe('Account Query', () => {
    test('Should return accounts on success', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      const postId = await (await insertPost(accountId)).insertedId
      const query = `query {
        post (id: "${postId}") {
          id
          title
          postedBy
          carBeingSold {
            brand
          }
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { post } = res.body.data
      expect(post.id).toBeTruthy()
      expect(post.title).toBe('any_title')
      expect(post.postedBy).toBe(accountId.toString())
      expect(post.carBeingSold.brand).toBe('any_brand')
    })
  })

  describe('Add Post Mutation', () => {
    const query = `mutation {
      addPost (
        title: "any_title",
        photos: ["any_photo_link.com", "other_photo_link.com"],
        description: "any_description",
        carBeingSold: {
          price: 999999,
          thumb: "any_thumb_link.com",
          fipePrice: 111111,
          brand: "any_brand",
          model: "any_model",
          year: "any_year",
          color: "any_color",
          doors: 4,
          steering: "any_steering",
          kmTraveled: 100000,
          carItems: [
            "airbag",
            "alarme",
            "ar quente",
            "teto solar"
          ],
          licensePlate: "any_license",
          sold: false,
          fastSale: true
        }
      )
    }`

    test('Should return 403 on add post without accessToken ', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
    })

    test('Should return 204 on add post success ', async () => {
      const res = await insertAccount()
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)
      await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken) // na requisição, eu coloco o accessToken nos headers
        .send({ query })
        .expect(200)
    })
  })

  describe('Delete Mutation', () => {
    const query = `mutation {
      deletePost (
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
        deletePost (
          id: "${postId}"
        ) {
          result
        }
      }`

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
    })
  })
})