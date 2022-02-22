import { LoadAccountByToken } from '@/domain/usecases'

export interface LoadAccountByTokenRepository {
  loadByToken (params: LoadAccountByTokenRepository.Params): LoadAccountByTokenRepository.Result
}

export namespace LoadAccountByTokenRepository {
  export type Params = LoadAccountByToken.Params
  export type Result = Promise<LoadAccountByToken.Result>
}
