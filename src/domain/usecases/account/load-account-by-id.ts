import { AccountModel } from '../../models/account'

export interface LoadAccountById {
  loadById (id: string): Promise<AccountModel>
}
