import { AccountModel } from '@/domain/models'

export interface LoadAccounts {
  load(): Promise<AccountModel[]>
}
