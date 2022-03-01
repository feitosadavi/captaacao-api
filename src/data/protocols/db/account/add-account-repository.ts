import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'

export interface AddAccountRepository {
  addAccount (params: AddAccountRepository.Params): AddAccountRepository.Result
}

export namespace AddAccountRepository {
  export type Params = {
    name: string
    profilePhoto: string
    profileType: string
    doc: string
    birthDate: string
    password: string
    email: string
    phone: string
    role: string

    adress: AccountModel.Adress
  }
  export type Result = AddAccount.Result
}
