import { AddPost } from '@/domain/usecases'

export interface AddPostRepository {
  addPost (params: AddPostRepository.Params): AddPostRepository.Result
}

export namespace AddPostRepository {
  export type Params = AddPost.Params
  export type Result = Promise<AddPost.Result>
}
