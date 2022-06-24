/* eslint-disable space-before-function-paren */
import { AddFavouritePost } from '@/domain/usecases'
import { AddFavouritePostRepository } from '@/data/protocols'

export class DbAddFavouritePost implements AddFavouritePost {
  constructor(
    private readonly addFavouritePostRepository: AddFavouritePostRepository
  ) { }

  async add (params: AddFavouritePost.Params): AddFavouritePost.Result {
    const result = await this.addFavouritePostRepository.addFavourite(params)
    return { ok: result }
  }
}
