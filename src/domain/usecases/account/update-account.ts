export interface UpdateAccount {
  update (params: UpdateAccount.Params): Promise<UpdateAccount.Result>
}

export namespace UpdateAccount {
  export type Params = {
    id: string
    fields: Record<string, any>
  }
  export type Result = boolean
}
