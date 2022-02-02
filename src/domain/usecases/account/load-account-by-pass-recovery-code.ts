export interface LoadAccountByPassRecoveryCode {
  load (params: LoadAccountByPassRecoveryCode.Params): Promise<LoadAccountByPassRecoveryCode.Result>
}

export namespace LoadAccountByPassRecoveryCode {
  export type Params = {
    code: number
  }
  export type Result = boolean
}
