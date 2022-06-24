import { AddFavouritePost } from '@/domain/usecases'

export interface AddFavouritePostRepository {
  addFavourite (params: AddFavouritePostRepository.Params): AddFavouritePostRepository.Result
}

export namespace AddFavouritePostRepository {
  export type Params = AddFavouritePost.Params
  export type Result = Promise<boolean>
}
