import { DbLoadProfiles } from '@/data/usecases'
import { ProfileMongoRepository } from '@/infra/db/mongodb'
import { LoadProfilesController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadProfilesController = (): Controller => {
  const carMongoRepository = new ProfileMongoRepository()
  const dbLoadProfiles = new DbLoadProfiles(carMongoRepository)
  return new LoadProfilesController(dbLoadProfiles)
}
