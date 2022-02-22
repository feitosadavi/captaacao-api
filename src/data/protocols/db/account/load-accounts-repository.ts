import { AccountModel } from '@/domain/models'

export interface LoadAccountsRepository {
  loadAccounts (): Promise<AccountModel[]>
}
