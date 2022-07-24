import MockDate from 'mockdate'
import { Collection } from 'mongodb'

import { AddProfileRepository } from '@/data/protocols'
import { MongoHelper, ProfileMongoRepository } from '@/infra/db/mongodb'

import { mockProfileModels } from '@tests/domain/mocks'

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

  describe('deleteProfile()', () => {
    test('Should return true on success', async () => {
      const sut = makeSut()

      const res = await profileCollection.insertOne({
        ...mockAddParams()
      })
      const id = String(res.insertedId)

      const deletionResult = await sut.deleteProfile({ id })
      expect(deletionResult).toBe(true)
    })
    test('Should return false if profile doesnt exists', async () => {
      const sut = makeSut()
      const deletionResult = await sut.deleteProfile({ id: '61539180dd2622353d5e11c8' })
      expect(deletionResult).toBe(false)
    })
  })

  describe('loadAccouts()', () => {
    test('Should return an account array on loadProfiles success', async () => {
      const sut = makeSut()

      await profileCollection.insertMany(mockProfileModels())

      const profiles = await sut.loadProfiles()
      expect(profiles).toBeTruthy()
      expect(profiles.length).toBe(2)
      expect(profiles[0].id).toBeTruthy()
      expect(profiles[1].id).toBeTruthy()
    })

    test('Should return null if loadProfiles fails', async () => {
      const sut = makeSut()
      const profile = await sut.loadProfiles()
      expect(profile).toEqual([])
    })
  })
})
