import { PostModel } from '@/domain/models'

export interface LoadAllPosts {
  load (): LoadAllPosts.Result
}

export namespace LoadAllPosts {
  export type Result = Promise<PostModel[]>
}
