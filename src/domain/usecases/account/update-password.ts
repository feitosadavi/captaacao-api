export interface UpdatePassword {
  update (params: UpdatePassword.Params): Promise<UpdatePassword.Result>
}

export namespace UpdatePassword {
  export type Params = {
    id: string
    password: string
  }
  export type Result = boolean
}
