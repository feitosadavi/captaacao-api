import { RemoveFavouritePost } from '@/domain/usecases'

export interface RemoveFavouritePostRepository {
  addFavourite (params: RemoveFavouritePostRepository.Params): RemoveFavouritePostRepository.Result
}

export namespace RemoveFavouritePostRepository {
  export type Params = RemoveFavouritePost.Params
  export type Result = Promise<boolean>
}
