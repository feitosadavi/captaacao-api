import { PostModel } from '@/domain/models'
import { LoadAllPosts } from '@/domain/usecases'

export interface LoadAllPostsRepository {
  loadAll (params: LoadAllPostsRepository.Params): Promise<LoadAllPostsRepository.Result>
}

export namespace LoadAllPostsRepository {
  export type Params = Omit<LoadAllPosts.Params, 'loadFilterOptions'>
  export type Result = { result: PostModel[], count?: { sold: number, notSold: number } }
}
