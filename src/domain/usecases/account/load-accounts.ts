import { AccountModel } from '@/domain/models/account'

export interface LoadAccounts {
  load(): Promise<AccountModel[]>
}
