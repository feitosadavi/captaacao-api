import { UpdatePost } from '@/domain/usecases'

export interface UpdatePostRepository {
  updatePost (params: UpdatePostRepository.Params): UpdatePostRepository.Result
}

export namespace UpdatePostRepository {
  export type Params = UpdatePost.Params
  export type Result = UpdatePost.Result
}
