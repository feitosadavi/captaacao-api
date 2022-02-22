import { DeleteAccount } from '@/domain/usecases'

export interface DeleteAccountRepository {
  deleteAccount (params: DeleteAccountRepository.Params): DeleteAccountRepository.Result
}

export namespace DeleteAccountRepository {
  export type Params = DeleteAccount.Params
  export type Result = DeleteAccount.Result
}
