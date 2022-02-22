import { AccountModel } from '@/domain/models'

export interface LoadAllAccounts {
  load(): LoadAllAccounts.Result
}

export namespace LoadAllAccounts {
  export type Result = Promise<AccountModel[]>
}
