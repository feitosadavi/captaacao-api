import { PostModel } from '@/domain/models'

export interface LoadAllPosts {
  load (params: LoadAllPosts.Params): LoadAllPosts.Result
}

export namespace LoadAllPosts {
  export type Params = {
    postedBy?: string
  }
  export type Result = Promise<PostModel[]>
}
