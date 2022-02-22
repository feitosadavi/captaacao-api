import { AccountModel } from '@/domain/models'

export interface LoadAccountByCode {
  load (params: LoadAccountByCode.Params): LoadAccountByCode.Result
}

export namespace LoadAccountByCode {
  export type Params = {
    code: number
  }
  export type Result = Promise<AccountModel | null>
}
