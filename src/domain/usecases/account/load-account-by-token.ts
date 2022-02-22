import { AccountModel } from '@/domain/models'

export interface LoadAccountByToken {
  load (params: LoadAccountByToken.Params): LoadAccountByToken.Result
}

export namespace LoadAccountByToken {
  export type Params = {
    accessToken: string
    role?: string
  }
  export type Result = Promise<AccountModel>
}
