import { AddProfileRepository } from '@/data/protocols'
import { MongoHelper } from '.'

export class ProfileMongoRepository implements AddProfileRepository {
  async add (params: AddProfileRepository.Params): Promise<AddProfileRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const result = await profilesCollection.insertOne(params)
    return !!result.insertedId
  }
}
