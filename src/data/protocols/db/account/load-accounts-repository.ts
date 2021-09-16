import { AccountModel } from '@/domain/models/account'

export interface LoadAccountsRepository {
  loadAccounts (): Promise<AccountModel[]>
}
