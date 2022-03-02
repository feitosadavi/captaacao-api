import { DeletePost } from '@/domain/usecases'

export interface DeletePostRepository {
  deletePost (params: DeletePostRepository.Params): DeletePostRepository.Result
}

export namespace DeletePostRepository {
  export type Params = DeletePost.Params
  export type Result = DeletePost.Result
}
