import { UpdateAccount } from '@/domain/usecases'

export interface UpdateAccountRepository {
  updateAccount (params: UpdateAccountRepository.Params): UpdateAccountRepository.Result
}

export namespace UpdateAccountRepository {
  export type Params = UpdateAccount.Params
  export type Result = UpdateAccount.Result
}
