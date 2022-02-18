import { AddProfileRepository, DeleteProfileRepository, LoadProfilesRepository, ProfileNameIsInUseRepository } from '@/data/protocols'
import { MongoHelper } from '.'

export class ProfileMongoRepository implements AddProfileRepository, ProfileNameIsInUseRepository, DeleteProfileRepository, LoadProfilesRepository {
  async add (params: AddProfileRepository.Params): Promise<AddProfileRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const result = await profilesCollection.insertOne(params)
    return !!result.insertedId
  }

  async loadProfiles (): Promise<LoadProfilesRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const profiles = await profilesCollection.find({}).toArray()
    return profiles && MongoHelper.mapCollection(profiles)
  }

  async deleteProfile ({ id }: DeleteProfileRepository.Params): Promise<DeleteProfileRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const deletionResult = await profilesCollection.deleteOne({ _id: id })
    return deletionResult.deletedCount === 1
  }

  async nameIsInUse ({ name }: ProfileNameIsInUseRepository.Params): Promise<ProfileNameIsInUseRepository.Result> {
    const profilesCollection = await MongoHelper.getCollection('profiles')
    const profile = await profilesCollection.findOne({ name })
    return !!profile._id
  }
}
