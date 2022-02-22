import { AccountModel } from '@/domain/models'

export interface LoadAccountById {
  load ({ id }: LoadAccountById.Params): LoadAccountById.Result
}

export namespace LoadAccountById {
  export type Params = {
    id: string
  }
  export type Result = Promise<AccountModel>
}
