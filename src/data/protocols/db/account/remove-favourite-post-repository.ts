import { RemoveFavouritePost } from '@/domain/usecases'

export interface RemoveFavouritePostRepository {
  removeFavourite (params: RemoveFavouritePostRepository.Params): RemoveFavouritePostRepository.Result
}

export namespace RemoveFavouritePostRepository {
  export type Params = RemoveFavouritePost.Params
  export type Result = Promise<boolean>
}
