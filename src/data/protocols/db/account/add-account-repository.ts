import { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository {
  addAccount (params: AddAccountRepository.Params): AddAccountRepository.Result
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params
  export type Result = AddAccount.Result
}
