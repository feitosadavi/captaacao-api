import { AccountModel } from '@/domain/models'

export interface LoadAccountByEmailRepository {
  loadByEmail (params: LoadAccountByEmailRepository.Params): LoadAccountByEmailRepository.Result
}

export namespace LoadAccountByEmailRepository {
  export type Params = {
    email: string
  }
  export type Result = Promise<AccountModel>
}
