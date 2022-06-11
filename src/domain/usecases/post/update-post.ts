export interface UpdatePost {
  update (params: UpdatePost.Params): UpdatePost.Result
}

export namespace UpdatePost {
  export type Params = {
    id: string
    fields: Record<string, any>
  }
  export type Result = Promise<boolean>
}
