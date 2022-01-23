import {
  AddAccount,
  LoadAccountByToken,
  LoadAccounts,
  LoadAccountById,
  DeleteAccount
} from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@tests/domain/mocks'

export const mockAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/require-await
    async add (params: AddAccount.Params): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddAccountStub()
}

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

export const mockDeleteAccount = (): DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    async delete (): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountStub()
}
