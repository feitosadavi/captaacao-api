import { DbAddFavouritePost } from '@/data/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { Controller } from '@/presentation/protocols'
import { AddFavouritePostController } from '@/presentation/controllers'
import { makeAddFavouritePostValidator } from './add-favourite-post-validation-factory'

export const makeAddFavouritePostControllerFactory = (): Controller => {
  const accountMongoRepository = new AccountMongoRepository()
  const dbUpdateAccount = new DbAddFavouritePost(accountMongoRepository)
  return new AddFavouritePostController(makeAddFavouritePostValidator(), dbUpdateAccount)
}
