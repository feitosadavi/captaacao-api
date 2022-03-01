import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { Express } from 'express'
import request from 'supertest'
import { mockAccountParams } from '@tests/domain/mocks'

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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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
      await accountCollection.insertOne({
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
      await accountCollection.insertOne({ password, ...mockAccountParams() })
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      console.log(res)
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
        profile: "any_profile",
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
      await accountCollection.insertOne({
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
})
