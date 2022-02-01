export interface PasswordRecover {
  recover (params: PasswordRecover.Params): Promise<PasswordRecover.Result>
}

export namespace PasswordRecover {
  export type Params = {
    id: string
    email: string
  }

  export type Result = boolean
}
