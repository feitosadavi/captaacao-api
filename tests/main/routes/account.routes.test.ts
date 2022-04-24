import { MongoHelper } from '@/infra/db/mongodb'
import { setupApp } from '@/main/config/app'

import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'
import fs from 'fs'

let accountsCollection: Collection
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let file: Buffer
let app: Express
const dir = './test_tmp'
describe('POST /signup', () => {
  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })
  beforeAll(async () => {
    createFile()
    await MongoHelper.connect(process.env.MONGO_URL)
    app = await setupApp()
  })
  const createFile = (): void => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    fs.openSync(`${dir}/file.txt`, 'w')
    fs.writeFileSync(`${dir}/file.txt`, 'Olá mundo!')
    file = fs.readFileSync(`${dir}/file.txt`)
  }

  afterAll(async () => {
    await MongoHelper.disconnect()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  test('Should return 200 on signup', async () => {
    const res = await request(app)
      .post('/api/signup')
      .field('name', 'any_name')
      .field('email', 'any_email@mail.com')
      .field('password', 'any_password')
      .field('passwordConfirmation', 'any_password')
      .field('doc', 'cpf_or_cnpj')
      .field('birthDate', '00/00/0000')
      .field('phone', 'any_phone')
      .field('profiles', ['any_profile', 'other_profile'])
      .field('cep', 'any_cep')
      .field('endereco', 'any_endereco')
      .field('complemento', 'any_complemento')
      .field('uf', 'any_uf')
      .field('cidade', 'any_cidade')
      .field('bairro', 'any_bairro')
      .attach('profilePhoto', `${dir}/file.txt`)
    expect(res.body.id).toBeTruthy()
    expect(res.body.accessToken).toBeTruthy()
    expect(res.body.name).toBe('any_name')
    expect(res.statusCode).toBe(200)
    // const res = await accountsCollection.findOne({ email: mockAccountParams().email })
    // expect(res.email).toEqual(mockAccountParams())
  })
})
