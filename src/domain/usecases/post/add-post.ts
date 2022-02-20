import { PostModel } from '../../models/post'

export type AddPostParams = Omit<PostModel, 'id'>

export interface AddPost {
  add (postData: AddPostParams): Promise<void>
}
