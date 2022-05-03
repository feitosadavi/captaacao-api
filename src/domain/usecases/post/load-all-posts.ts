import { PostModel } from '@/domain/models'

export interface LoadAllPosts {
  load (params: LoadAllPosts.Params): LoadAllPosts.Result
}

export namespace LoadAllPosts {
  export type Params = {
    postedBy?: string
    search?: string
    skip?: number
    color?: string[]
    brand?: string[]
    year?: string[]
    steering?: string[]
    engine?: string[]
    doors?: string[]
  }
  export type Result = Promise<PostModel[]>
}
