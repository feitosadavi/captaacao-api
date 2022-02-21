import { LoadAllPosts } from '@/domain/usecases'

export interface LoadAllPostsRepository {
  loadAll (): LoadAllPostsRepository.Result
}

export namespace LoadAllPostsRepository {
  export type Result = Promise<LoadAllPosts.Result>
}
