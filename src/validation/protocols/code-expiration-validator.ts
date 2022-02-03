export interface CodeExpiration {
  isExpired (params: CodeExpiration.Params): CodeExpiration.Result
}

export namespace CodeExpiration {
  export type Params = {
    expiresAt: Date
  }
  export type Result = boolean
}
