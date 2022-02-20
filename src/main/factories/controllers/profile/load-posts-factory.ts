import { DbLoadProfiles } from '@/data/usecases'
import { ProfileMongoRepository } from '@/infra/db/mongodb'
import { LoadProfilesController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadProfilesController = (): Controller => {
  const postMongoRepository = new ProfileMongoRepository()
  const dbLoadProfiles = new DbLoadProfiles(postMongoRepository)
  return new LoadProfilesController(dbLoadProfiles)
}
