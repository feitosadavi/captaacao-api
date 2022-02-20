import { PostModel } from '../../models/post'

export interface LoadPostById {
  loadById (id: string): Promise<PostModel>
}
