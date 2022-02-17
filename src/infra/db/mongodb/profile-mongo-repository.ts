import { AddProfileRepository, ProfileNameIsInUseRepository } from '@/data/protocols'
import { MongoHelper } from '.'

export class ProfileMongoRepository implements AddProfileRepository, ProfileNameIsInUseRepository {
  async add (params: AddProfileRepository.Params): Promise<AddProfileRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const result = await profilesCollection.insertOne(params)
    return !!result.insertedId
  }

  // trocar por name is in use
  async nameIsInUse ({ name }: ProfileNameIsInUseRepository.Params): Promise<ProfileNameIsInUseRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const profile = await profilesCollection.findOne({ name })
    return !!profile._id
  }
}
