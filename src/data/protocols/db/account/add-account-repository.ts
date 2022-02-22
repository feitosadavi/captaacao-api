import { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository {
  add (params: AddAccountRepository.Params): Promise<boolean>
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params
  export type Result = boolean
}
