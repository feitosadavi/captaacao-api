import { AddPost } from '@/domain/usecases'

export interface AddPostRepository {
  addPost (params: AddPostRepository.Params): AddPostRepository.Result
}

export namespace AddPostRepository {
  export type Params = Omit<AddPost.Params, 'photos'> & {
    photos: string[]
  }
  export type Result = Promise<AddPost.Result>
}
