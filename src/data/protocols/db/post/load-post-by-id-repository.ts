import { LoadPostById } from '@/domain/usecases'

export interface LoadPostByIdRepository {
  loadById (params: LoadPostByIdRepository.Params): LoadPostByIdRepository.Result
}

export namespace LoadPostByIdRepository {
  export type Params = LoadPostById.Params
  export type Result = Promise<LoadPostById.Result>
}
