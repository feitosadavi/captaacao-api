import { AccountModel } from '../models'

export interface Authentication {
  auth: (authenticationParams: Authentication.Params) => Authentication.Result
}

export namespace Authentication {
  export type Params = {
    email: string
    password: string
  }

  export type Result = Promise<AccountModel>
}
