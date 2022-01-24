import { Collection } from 'mongodb'
import { MongoHelper, CarMongoRepository } from '@/infra/db/mongodb'
import { mockCarsParams } from '@tests/domain/mocks'

describe('CarMongo Repository', () => {
  let carsCollection: Collection

  // antes e depois de cada teste de integração, precisamos conectar e desconectar do banco
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  // removo todos os registros da tabela antes de cada teste. Para não populuir as tabelas
  beforeEach(async () => {
    carsCollection = await MongoHelper.getCollection('cars')
    await carsCollection.deleteMany({})
  })

  const makeSut = (): CarMongoRepository => {
    return new CarMongoRepository()
  }

  describe('add()', () => {
    test('Should create a car on add success', async () => {
      const sut = makeSut()
      await sut.add(mockCarsParams()[0])
      const car = await carsCollection.findOne({ name: 'any_name' })
      expect(car).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all cars on load success', async () => {
      const sut = makeSut()
      await carsCollection.insertMany([
        { ...mockCarsParams()[0] },
        { ...mockCarsParams()[1] }
      ])
      const cars = await sut.loadAll()
      expect(cars.length).toBe(2)
      expect(cars[0].name).toBe('any_name')
      expect(cars[1].name).toBe('other_name')
    })

    test('Should load empty list if collection has no cars', async () => {
      const sut = makeSut()
      const cars = await sut.loadAll()
      expect(cars.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return a car on success', async () => {
      const res = await carsCollection.insertOne({ ...mockCarsParams()[0] })
      const sut = makeSut()
      const car = await sut.loadById(res.ops[0]._id)
      expect(car).toBeTruthy()
      expect(car.id).toBeTruthy()
    })
  })
})
