import { AccountModel } from '@/domain/models'

export interface LoadAccountById {
  loadById (id: string): Promise<AccountModel>
}
