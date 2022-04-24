import { PostModel } from '@/domain/models'

export interface AddPost {
  add (params: AddPost.Params): AddPost.Result
}

export namespace AddPost {
  export type Params = {
    title: string
    photos: Array<{
      fileName: string
      buffer: Buffer
      mimeType: string
    }>
    description: string

    createdAt: Date
    modifiedAt: Date
    postedBy: string
    status: boolean
    active: boolean

    views: number

    carBeingSold: Omit<PostModel.CarBeingSold, 'thumb'>
  }
  export type Result = Promise<void>
}
