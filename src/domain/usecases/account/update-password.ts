export interface UpdatePassword {
  update (params: UpdatePassword.Params): UpdatePassword.Result
}

export namespace UpdatePassword {
  export type Params = {
    id: string
    password: string
  }
  export type Result = Promise<boolean>
}
