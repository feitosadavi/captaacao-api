export interface DeletePost {
  delete (params: DeletePost.Params): DeletePost.Result
}

export namespace DeletePost {
  export type Params = {
    id: string
  }
  export type Result = Promise<boolean>
}
