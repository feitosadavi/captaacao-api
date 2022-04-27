import { LoadAllPosts } from '@/domain/usecases'

export interface LoadAllPostsRepository {
  loadAll (params: LoadAllPostsRepository.Params): LoadAllPostsRepository.Result
}

export namespace LoadAllPostsRepository {
  export type Params = LoadAllPosts.Params
  export type Result = Promise<LoadAllPosts.Result>
}
