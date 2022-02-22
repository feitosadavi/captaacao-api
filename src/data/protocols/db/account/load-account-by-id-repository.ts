import { LoadAccountById } from '@/domain/usecases'

export interface LoadAccountByIdRepository {
  loadById (params: LoadAccountByIdRepository.Params): LoadAccountByIdRepository.Result
}

export namespace LoadAccountByIdRepository {
  export type Params = LoadAccountById.Params
  export type Result = Promise<LoadAccountById.Result>
}
