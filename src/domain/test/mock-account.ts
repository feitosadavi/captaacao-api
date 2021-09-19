import { LoadAccountById } from '@/presentation/controllers/account/load-account-by-id/load-account-by-id-protocols'
import { LoadAccounts } from '@/presentation/controllers/account/load-accounts/load-accounts-controller-protocols'
import { AccountModel } from '../models/account'
import { LoadAccountByToken } from '../usecases/account/load-account-by-token'
import { mockAccountModel } from './mock-account-repository'

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenStub()
}

export const mockLoadAccounts = (): LoadAccounts => {
  class LoadAccountsStub implements LoadAccounts {
    async load (): Promise<AccountModel[]> {
      return Promise.resolve([mockAccountModel()])
    }
  }

  return new LoadAccountsStub()
}

export const mockLoadAccountById = (): LoadAccountById => {
  class LoadAccountByIdStub implements LoadAccountByIdStub {
    async loadById (): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByIdStub()
}
