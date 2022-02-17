import { AddProfileRepository, CheckProfileByNameRepository } from '@/data/protocols'
import { MongoHelper } from '.'

export class ProfileMongoRepository implements AddProfileRepository, CheckProfileByNameRepository {
  async add (params: AddProfileRepository.Params): Promise<AddProfileRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const result = await profilesCollection.insertOne(params)
    return !!result.insertedId
  }

  // trocar por name is in use
  async checkByName ({ name }: CheckProfileByNameRepository.Params): Promise<CheckProfileByNameRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const profile = await profilesCollection.findOne({ name })
    return !!profile._id
  }
}
