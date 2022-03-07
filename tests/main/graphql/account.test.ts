import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection, InsertOneWriteOpResult } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'
import { mockAccountParams } from '@tests/domain/mocks'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let accountsCollection: Collection
let app: Express

const insertAccount = async (): Promise<InsertOneWriteOpResult<any>> => {
  return accountsCollection.insertOne({
    name: 'Anderson Moreira Santos',
    email: 'andersantos@gmail.com',
    password: '789456123',
    doc: '58978963252',
    birthDate: '05/10/1970',
    phone: '5563982266580',
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

describe('Account GraphQL', () => {
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
  })

  describe('Login Query', () => {
    const query = `query {
      login (email: "rodrigo.manguinho@gmail.com", password: "123") {
        accessToken
        name
      }
    }`

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Rodrigo',
        email: 'rodrigo.manguinho@gmail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.name).toBe('Rodrigo')
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(401)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('Accounts Query', () => {
    const query = `query {
      accounts {
        id
        name
        doc
      }
    }`

    test('Should return accounts on success', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({ password, ...mockAccountParams() })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.accounts[0].id).toBeTruthy()
      expect(res.body.data.accounts[0].name).toBe('any_name')
      expect(res.body.data.accounts[0].doc).toBe('cpf_or_cnpj')
    })

    // test('Should return UnauthorizedError on invalid credentials', async () => {
    //   const res = await request(app)
    //     .post('/graphql')
    //     .send({ query })
    //   expect(res.status).toBe(401)
    //   expect(res.body.data).toBeFalsy()
    //   expect(res.body.errors[0].message).toBe('Unauthorized')
    // })
  })

  describe('Account Query', () => {
    test('Should return accounts on success', async () => {
      const password = await hash('123', 12)
      const insertResult = await accountsCollection.insertOne({ password, ...mockAccountParams() })
      const id: string = insertResult.insertedId
      const query = `query {
        account (id: "${id}") {
          id
          name
          doc
        }
      }`
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.account.id).toBeTruthy()
      expect(res.body.data.account.name).toBe('any_name')
      expect(res.body.data.account.doc).toBe('cpf_or_cnpj')
    })
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password",
        doc: "cpf_or_cnpj",
        birthDate: "00/00/0000",
        phone: "any_phone",
        profiles: ["any_profile", "other_profile"],
        profilePhoto: "any_photo_link",
        cep: "any_cep",
        endereco: "any_endereco",
        complemento: "any_complemento",
        uf: "any_uf",
        cidade: "any_cidade",
        bairro: "any_bairro"
      ) {
        accessToken
        name
      }
    }`

    test('Should return an Account on valid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.name).toBe('any_name')
    })

    test('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12)
      await accountsCollection.insertOne({
        name: 'Rodrigo',
        email: 'any_email@mail.com',
        password
      })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('The received email is alredy in use') // corrigir ortografia
    })
  })

  describe('Update Mutation', () => {
    const query = `mutation {
      updateAccount (name: "Davi") {
        ok
      }
    }`
    test('should return 403 if user has no authorization', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
    })
    test('should return 200 on success', async () => {
      const insertResult = await insertAccount()
      const id = insertResult.insertedId
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
    })
  })

  describe('Delete Mutation', () => {
    const makeDeleteQuery = (id: string): string => (`mutation {
      deleteAccount(id: "${id}") {
        result
      }
    }`)
    test('should return 403 if user has no authorization', async () => {
      const query = makeDeleteQuery('any_id')
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
    })

    test('should return 200 on success', async () => {
      const insertResult = await insertAccount()
      const id = insertResult.insertedId
      const accessToken = sign({ id }, env.secret)
      await updateAccountToken(id, accessToken)
      const query = makeDeleteQuery(id)
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
    })
  })
})
