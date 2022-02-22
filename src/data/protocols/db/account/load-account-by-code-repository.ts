import { LoadAccountByCode } from '@/domain/usecases'

export interface LoadAccountByCodeRepository {
  loadByCode (params: LoadAccountByCodeRepository.Params): LoadAccountByCodeRepository.Result
}

export namespace LoadAccountByCodeRepository {
  export type Params = LoadAccountByCode.Params
  export type Result = Promise<LoadAccountByCode.Result>
}
