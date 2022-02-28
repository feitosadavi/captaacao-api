import {
  AddAccount,
  LoadAccountByToken,
  LoadAllAccounts,
  LoadAccountById,
  DeleteAccount,
  UpdateAccount,
  LoadIdByEmail,
  PasswordRecover,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LoadAccountByCode,
  UpdatePassword
} from '@/domain/usecases'
import { Authentication } from '@/domain/usecases/authentication'

import { mockAccountModel, mockAccountConfirmationCode } from '@tests/domain/mocks'

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
    async load (params: LoadAccountByToken.Params): LoadAccountByToken.Result {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenStub()
}

export const mockLoadAllAccounts = (): LoadAllAccounts => {
  class LoadAllAccountsStub implements LoadAllAccounts {
    async load (): LoadAllAccounts.Result {
      return Promise.resolve([mockAccountModel()])
    }
  }

  return new LoadAllAccountsStub()
}

export const mockLoadAccountById = (): LoadAccountById => {
  class LoadAccountByIdStub implements LoadAccountByIdStub {
    async load (params: LoadAccountById.Params): LoadAccountById.Result {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByIdStub()
}

export const mockLoadIdByEmail = (): LoadIdByEmail => {
  class LoadIdByEmailStub implements LoadIdByEmailStub {
    async load (params: LoadIdByEmail.Params): LoadIdByEmail.Result {
      return Promise.resolve(mockAccountModel().id)
    }
  }
  return new LoadIdByEmailStub()
}

export const mockLoadAccountByCode = (): LoadAccountByCode => {
  class LoadAccountByCode implements LoadAccountByCode {
    async load (params: LoadAccountByCode.Params): LoadAccountByCode.Result {
      return Promise.resolve({ ...mockAccountModel(), code: { ...mockAccountConfirmationCode() } })
    }
  }
  return new LoadAccountByCode()
}

export const mockUpdateAccount = (): UpdateAccount => {
  class UpdateAccountStub implements UpdateAccount {
    async update (params: UpdateAccount.Params): UpdateAccount.Result {
      return Promise.resolve(true)
    }
  }
  return new UpdateAccountStub()
}

export const mockUpdatePassword = (): UpdatePassword => {
  class UpdatePasswordStub implements UpdatePassword {
    async update (params: UpdatePassword.Params): UpdatePassword.Result {
      return Promise.resolve(true)
    }
  }
  return new UpdatePasswordStub()
}

export const mockDeleteAccount = (): DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    async delete (params: DeleteAccount.Params): DeleteAccount.Result {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountStub()
}

export const mockPasswordRecover = (): PasswordRecover => {
  class PasswordRecoverStub implements PasswordRecover {
    async recover (params: PasswordRecover.Params): PasswordRecover.Result {
      return Promise.resolve(true)
    }
  }
  return new PasswordRecoverStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (params: Authentication.Params): Authentication.Result {
      return Promise.resolve({ accessToken: 'any_token', name: 'any_name' })
    }
  }

  return new AuthenticationStub()
}
