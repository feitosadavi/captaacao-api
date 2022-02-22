import { AccountModel } from '@/domain/models'

export interface LoadAccountByToken {
  load (accessToekn: string, role?: string): Promise<AccountModel>
}
