import { Collection } from 'mongodb'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { LogMongoRepository, MongoHelper } from '@/infra/db/mongodb'

const makeSut = (): LogErrorRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  test('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1) // eu inseri 1 erro, então espero que a quantidade de registros na collection count seja 1
  })
})
