import { LoadAllAccounts } from '@/domain/usecases'

export interface LoadAllAccountsRepository {
  loadAll (): LoadAllAccountsRepository.Result
}

export namespace LoadAllAccountsRepository {
  export type Result = LoadAllAccounts.Result
}
