import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection, InsertOneResult } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { hash } from 'bcrypt'
import { mockAccountParams } from '@tests/domain/mocks'

let accountsCollection: Collection
let postsCollection: Collection
let app: Express

const insertAccount = async (): Promise<InsertOneResult<any>> => {
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

const insertPost = async (postedBy: string): Promise<InsertOneResult<any>> => {
  return postsCollection.insertOne({
    title: 'any_title',
    postedBy: postedBy,
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

  const QUERY_FIELDS = `
    posts {
      id
      title
      postedBy {
        name
      }
      carBeingSold {
        brand
      }
    }
  `

  describe('Posts Query', () => {
    test('Should return all posts on success', async () => {
      const password = await hash('123', 12)
      const accountId = (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(String(accountId))
      const query = `query {
        posts {
          ${QUERY_FIELDS}
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts: { posts } } = res.body.data
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should skip some posts given skip value', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(String(accountId))
      await insertPost(String(accountId))
      const query = `query {
        posts (skip: 1){
          ${QUERY_FIELDS}
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts: { posts } } = res.body.data
      expect(posts.length).toBe(1)
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should return filtered accounts if it has filters', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(String(accountId))
      const query = `query {
        posts (postedBy: "${accountId}"){
          ${QUERY_FIELDS}
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts: { posts } } = res.body.data
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should return filter accounts with array filters', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(String(accountId))
      const query = `query {
        posts (brand: ["any_brand", "other_brand"]){
          ${QUERY_FIELDS}
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts: { posts } } = res.body.data
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should search posts if search param was passed', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(String(accountId))
      const query = `query {
        posts(search: "") {
          ${QUERY_FIELDS}
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts: { posts } } = res.body.data
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
    })

    test('Should load filter options if loadFilterOptions params was passed', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      await insertPost(String(accountId))
      const query = `query {
        posts (loadFilterOptions: true) {
          ${QUERY_FIELDS}
          filterOptions {
            brand
            model
            fuel
            year
            color
            doors
            steering
          }
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      const { posts: { posts, filterOptions } } = res.body.data
      expect(posts[0].id).toBeTruthy()
      expect(posts[0].title).toBe('any_title')
      expect(posts[0].postedBy.name).toBe('any_name')
      expect(posts[0].carBeingSold.brand).toBe('any_brand')
      expect(filterOptions.brand).toEqual(['any_brand'])
    })
  })

  describe('Post Query', () => {
    test('Should return accounts on success', async () => {
      const password = await hash('123', 12)
      const accountId = await (await accountsCollection.insertOne({ password, ...mockAccountParams() })).insertedId
      const postId = await (await insertPost(String(accountId))).insertedId
      const query = `query {
        post (id: "${String(postId)}") {
          id
          title
          postedBy {
            name
          }
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
      expect(post.postedBy.name).toBe('any_name')
      expect(post.carBeingSold.brand).toBe('any_brand')
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
      const accountId = String(insertAccountResult.insertedId)
      const accessToken = sign({ id: accountId }, env.secret)
      await updateAccountToken(accountId, accessToken)

      const insertPostResult = await insertPost(String(accountId))
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
