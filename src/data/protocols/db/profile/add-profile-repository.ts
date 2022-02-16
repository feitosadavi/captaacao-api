import { AddProfile } from '@/domain/usecases'

export interface AddProfileRepository {
  add (params: AddProfileRepository.Params): Promise<AddProfileRepository.Result>
}

export namespace AddProfileRepository {
  export type Params = AddProfile.Params
  export type Result = boolean
}
