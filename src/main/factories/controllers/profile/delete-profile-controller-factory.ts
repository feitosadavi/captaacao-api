import { DbDeleteProfile } from '@/data/usecases'
import { ProfileMongoRepository } from '@/infra/db/mongodb'
import { DeleteProfileController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeDeleteProfileController = (): Controller => {
  const accountMongoRepository = new ProfileMongoRepository()
  const dbDeleteProfile = new DbDeleteProfile(accountMongoRepository)

  return new DeleteProfileController(dbDeleteProfile)
}
