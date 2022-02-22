export interface PasswordRecover {
  recover (params: PasswordRecover.Params): PasswordRecover.Result
}

export namespace PasswordRecover {
  export type Params = {
    id: string
    email: string
  }

  export type Result = Promise<boolean>
}
