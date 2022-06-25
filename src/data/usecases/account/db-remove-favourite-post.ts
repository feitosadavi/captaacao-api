/* eslint-disable space-before-function-paren */
import { RemoveFavouritePost } from '@/domain/usecases'
import { RemoveFavouritePostRepository } from '@/data/protocols'

export class DbRemoveFavouritePost implements RemoveFavouritePost {
  constructor(
    private readonly removeFavouritePostRepository: RemoveFavouritePostRepository
  ) { }

  async remove (params: RemoveFavouritePost.Params): RemoveFavouritePost.Result {
    const result = await this.removeFavouritePostRepository.removeFavourite(params)
    return { ok: result }
  }
}
