import { PostModel } from '@/domain/models'

export interface AddPost {
  add (params: AddPost.Params): AddPost.Result
}

export namespace AddPost {
  export type Params = {
    title: string
    photos: string[]
    description: string

    createdAt: Date
    modifiedAt: Date
    postedBy: string
    status: boolean
    active: boolean

    views: number

    carBeingSold: PostModel.CarBeingSold
  }
  export type Result = Promise<void>
}
