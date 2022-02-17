import MockDate from 'mockdate'

import { Collection } from 'mongodb'
import { MongoHelper, ProfileMongoRepository } from '@/infra/db/mongodb'
import { AddProfileRepository } from '@/data/protocols'

const mockAddParams = (): AddProfileRepository.Params => ({
  name: 'any_name',
  createdBy: 'any_account_id',
  createdAt: new Date()
})

describe('Profile Mongo Repository', () => {
  let profileCollection: Collection

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
    profileCollection = await MongoHelper.getCollection('profiles')
    await profileCollection.deleteMany({})
  })

  const makeSut = (): ProfileMongoRepository => {
    return new ProfileMongoRepository()
  }

  describe('add()', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()
      const result = await sut.add({ ...mockAddParams() })
      expect(result).toBe(true)
    })
  })

  describe('nameIsInUse()', () => {
    test('Should return true if profile exists', async () => {
      await profileCollection.insertOne({ ...mockAddParams() })
      const sut = makeSut()
      const result = await sut.nameIsInUse({ name: 'any_name' })
      expect(result).toBe(true)
    })

    test('Should return false if profile do not exists', async () => {
      await profileCollection.insertOne({ ...mockAddParams() })
      const sut = makeSut()
      const result = await sut.nameIsInUse({ name: 'any_name' })
      expect(result).toBe(true)
    })
  })
})
