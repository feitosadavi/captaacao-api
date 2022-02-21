import { PostModel } from '@/domain/models'

export interface LoadPostById {
  load (params: LoadPostById.Params): LoadPostById.Result
}

export namespace LoadPostById {
  export type Params = {
    id: string
  }
  export type Result = Promise<PostModel>
}
