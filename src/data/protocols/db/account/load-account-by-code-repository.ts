import { AccountModel } from '@/domain/models/account'

export interface LoadAccountByCodeRepository {
  loadByCode (params: LoadAccountByCodeRepository.Params): Promise<LoadAccountByCodeRepository.Result>
}

export namespace LoadAccountByCodeRepository {
  export type Params = {
    code: number
  }
  export type Result = AccountModel
}
