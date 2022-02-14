import { UpdatePassword } from '@/domain/usecases'

export interface UpdatePasswordRepository {
  updatePassword (params: UpdatePasswordRepository.Params): Promise<UpdatePasswordRepository.Result>
}

export namespace UpdatePasswordRepository {
  export type Params = UpdatePassword.Params
  export type Result = boolean
}
