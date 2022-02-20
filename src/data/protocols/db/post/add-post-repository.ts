import { AddPostParams } from '@/domain/usecases'

export interface AddPostRepository {
  add (postData: AddPostParams): Promise<void>
}
