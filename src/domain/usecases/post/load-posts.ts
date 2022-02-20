import { PostModel } from '@/domain/models/post'

export interface LoadPosts {
  load (): Promise<PostModel[]>
}
