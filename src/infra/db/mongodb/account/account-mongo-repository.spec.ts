import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection

  // antes e depois de cada teste de integração, precisamos conectar e desconectar do banco
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
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

  const makeFakeAccounts = (): AddAccountParams[] => ([{
    name: 'Anderson Moreira Santos',
    email: 'andersantos@gmail.com',
    password: '789456123',
    cpf: '58978963252',
    birthDate: '05/10/1970',
    phoneNumber: '5563982266580',
    role: 'admin'
  }, {
    name: 'Renata Cardoso Castro',
    email: 'renatacastro@gmail.com',
    password: '369258147',
    cpf: '02514563235',
    birthDate: '20/08/1995',
    phoneNumber: '5561994468529',
    role: 'avaliador'
  }])

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add({
        ...makeFakeAccounts()[0]
      })
      expect(account).toBeTruthy() // eu espero que tenha retornado algum valor do "add"
      expect(account.id).toBeTruthy() // espero que a account tenha algum id
      expect(account.name).toBe('Anderson Moreira Santos')
      expect(account.email).toBe('andersantos@gmail.com')
      expect(account.password).toBe('789456123')
      expect(account.cpf).toBe('58978963252')
      expect(account.birthDate).toBe('05/10/1970')
      expect(account.phoneNumber).toBe('5563982266580')
      expect(account.role).toBe('admin')
    })
  })

  describe('loadAccouts()', () => {
    test('Should return an account array on loadAccouts success', async () => {
      const sut = makeSut()

      await accountCollection.insertMany([{
        ...makeFakeAccounts()[0]

      }, {
        ...makeFakeAccounts()[1]

      }])

      const accounts = await sut.loadAccounts()
      expect(accounts).toBeTruthy()
      expect(accounts.length).toBe(2)
      expect(accounts[0].id).toBeTruthy()
      expect(accounts[0].name).toBe('Anderson Moreira Santos')
      expect(accounts[0].email).toBe('andersantos@gmail.com')
      expect(accounts[0].password).toBe('789456123')
    })

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadAccounts()
      expect(account).toEqual([])
    })
  })

  describe('loadById()', () => {
    test('Should return an account on loadById success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne({
        ...makeFakeAccounts()[0]
      })

      const account = await sut.loadById(res.ops[0]._id)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Anderson Moreira Santos')
      expect(account.email).toBe('andersantos@gmail.com')
      expect(account.password).toBe('789456123')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...makeFakeAccounts()[0]
      })

      const account = await sut.loadByEmail('andersantos@gmail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Anderson Moreira Santos')
      expect(account.email).toBe('andersantos@gmail.com')
      expect(account.password).toBe('789456123')
    })

    test('Should return null if loadByEmail fails', async () => {
      // não criei uma fake account, induzindo o método a falhar
      const sut = makeSut()
      const account = await sut.loadByEmail('andersantos@gmail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('loadByToken', () => {
    test('Should return an account on loadByToken success without role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...makeFakeAccounts()[0],
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Anderson Moreira Santos')
      expect(account.email).toBe('andersantos@gmail.com')
      expect(account.password).toBe('789456123')
    })

    test('Should return an account on loadByToken success with admin role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...makeFakeAccounts()[0],
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Anderson Moreira Santos')
      expect(account.email).toBe('andersantos@gmail.com')
      expect(account.password).toBe('789456123')
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...makeFakeAccounts()[1],
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken success if user is admin', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        ...makeFakeAccounts()[0],
        accessToken: 'any_token'
      })

      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('Anderson Moreira Santos')
      expect(account.email).toBe('andersantos@gmail.com')
      expect(account.password).toBe('789456123')
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()

      const res = await accountCollection.insertOne({
        ...makeFakeAccounts()[1]
      })
      const fakeAccount = res.ops[0]
      expect(fakeAccount.accessToken).toBeFalsy() // espero que primeiro não tenha accessToken
      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account = await accountCollection.findOne({ _id: fakeAccount._id })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('deleteAccount', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()

      const res = await accountCollection.insertOne({
        ...makeFakeAccounts()[0]
      })
      const id = res.ops[0]._id

      const deletionResult = await sut.deleteAccount(id)
      expect(deletionResult).toBe(true)
    })
    test('Should return false if account doesnt exists', async () => {
      const sut = makeSut()
      const deletionResult = await sut.deleteAccount('61539180dd2622353d5e11c8')
      expect(deletionResult).toBe(false)
    })
  })
})
