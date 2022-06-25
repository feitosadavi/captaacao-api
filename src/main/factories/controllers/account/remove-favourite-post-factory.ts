import { DbRemoveFavouritePost } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { Controller } from '@/presentation/protocols'
import { RemoveFavouritePostController } from '@/presentation/controllers'
import { makeRemoveFavouritePostValidator } from './remove-favourite-post-validation-factory'

export const makeRemoveFavouritePostControllerFactory = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbRemoveFavouritePost(accountMongoRepository)
  return new RemoveFavouritePostController(makeRemoveFavouritePostValidator(), dbUpdateAccount)
}
