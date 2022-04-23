import MockDate from 'mockdate'
import { Collection } from 'mongodb'

import { AccountModel } from '@/domain/models'
import { MongoHelper, AccountMongoRepository } from '@/infra/db/mongodb'

import { mockAccountParams, mockAccountConfirmationCode } from '@tests/domain/mocks'
import { mockAccountRepositoryParams } from '@tests/data/mocks'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  // antes e depois de cada teste de integração, precisamos conectar e desconectar do banco
  beforeAll(async () => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    MockDate.reset() // congela a data com base no valor inserido
    await MongoHelper.disconnect()
  })

  // removo todos os registros da tabela antes de cada teste. Para não populuir as tabelas
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return true success', async () => {
      const sut = makeSut()
      const result = await sut.addAccount({ ...mockAccountRepositoryParams() })
      expect(result).toBe(true)
      // eu espero que tenha retornado algum valor do "add"
      // expect(account.id).toBeTruthy() // espero que a account tenha algum id
      // expect(account.name).toBe('any_name')
      // expect(account.email).toBe('any_email@mail.com')
      // expect(account.password).toBe('789456123')
      // expect(account.doc).toBe('58978963252')
      // expect(account.birthDate).toBe('05/10/1970')
      // expect(account.phone).toBe('5563982266580')
      // expect(account.profiles).toBe('admin')
    })
  })

  describe('loadAccouts()', () => {
    test('Should return an account array on loadAccouts success', async () => {
      const sut = makeSut()

      await accountCollection.insertMany([{
        ...mockAccountParams()
      }, {
        ...mockAccountParams()
      }])

      const accounts = await sut.loadAll()
      expect(accounts).toBeTruthy()
      expect(accounts.length).toBe(2)
      expect(accounts[0].id).toBeTruthy()
      expect(accounts[0].name).toBe('any_name')
      expect(accounts[0].email).toBe('any_email@mail.com')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadAll()
      expect(account).toEqual([])
    })
  })

  describe('loadById()', () => {
    test('Should return an account on loadById success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        ...mockAccountParams()
      })

      const account = await sut.loadById(res.ops[0]._id)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...mockAccountParams()
      })

      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null if loadByEmail fails', async () => {
      // não criei uma fake account, induzindo o método a falhar
      const sut = makeSut()
      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeFalsy()
    })
  })

  describe('loadByCode()', () => {
    test('Should return an account on loadByCode success', async () => {
      const sut = makeSut()
      const code = mockAccountConfirmationCode()
      await accountCollection.insertOne({
        ...mockAccountParams(),
        code
      })
      const account = await sut.loadByCode({ code: code.number })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null if loadByCode fails', async () => {
      // não criei uma fake account, induzindo o método a falhar
      const sut = makeSut()
      const account = await sut.loadByEmail({ email: 'any_email@mail.com' })
      expect(account).toBeFalsy()
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success without profiles', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token' })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return an account on loadByToken success with admin profiles', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...mockAccountParams(),
        profiles: ['admin', 'queijo'],
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token', profiles: ['queijo', 'girafa'] })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null on loadByToken if it was loaded with a profiles that doesnt belongs to its account', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token', profiles: ['admin', 'girafakkkk'] })
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken success if user is admin', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...mockAccountParams(),
        accessToken: 'any_access_token'
      })

      const account = await sut.loadByToken({ accessToken: 'any_access_token' })
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken({ accessToken: 'any_access_token', profiles: ['admin'] })
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()

      const res = await accountCollection.insertOne({
        ...mockAccountParams()
      })
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy() // espero que primeiro não tenha accessToken
      await sut.updateAccessToken({ id: fakeAccount._id, accessToken: 'any_access_token' })
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_access_token')
    })
  })

  describe('updateAccount()', () => {
    test('Should update the account fields on updateAccount success', async () => {
      const sut = makeSut()

      const res = await accountCollection.insertOne({
        ...mockAccountParams()
      })
      const fakeAccount = res.ops[0]
      const result = await sut.updateAccount({ id: fakeAccount._id, fields: { name: 'other_name', cep: 'other_cep' } })
      expect(result).toBe(true)
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.name).toBe('other_name')
      expect(account.cep).toBe('other_cep')
    })
  })

  describe('updatePassword()', () => {
    test('Should update accounts password on updatePassword success', async () => {
      const sut = makeSut()

      const res = await accountCollection.insertOne({
        ...mockAccountParams()
      })
      const fakeAccount = res.ops[0]
      const result = await sut.updatePassword({ id: fakeAccount._id, password: 'other_password' })
      expect(result).toBe(true)
      const account: AccountModel = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.password !== fakeAccount._id).toBe(true)
    })
  })

  describe('deleteAccount', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()

      const res = await accountCollection.insertOne({
        ...mockAccountParams()
      })
      const id = res.ops[0]._id

      const deletionResult = await sut.deleteAccount(id)
      expect(deletionResult).toBe(true)
    })
    test('Should return false if account doesnt exists', async () => {
      const sut = makeSut()
      const deletionResult = await sut.deleteAccount({ id: '61539180dd2622353d5e11c8' })
      expect(deletionResult).toBe(false)
    })
  })
})
