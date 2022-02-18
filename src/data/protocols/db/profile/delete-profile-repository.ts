import { DeleteProfile } from '@/domain/usecases'

export interface DeleteProfileRepository {
  deleteProfile (params: DeleteProfileRepository.Params): Promise<DeleteProfileRepository.Result>
}

export namespace DeleteProfileRepository {
  export type Params = DeleteProfile.Params
  export type Result = boolean
}
