import {
  AddAccount,
  LoadAccountByToken,
  LoadAccounts,
  LoadAccountById,
  DeleteAccount,
  UpdateAccount,
  LoadIdByEmail,
  PasswordRecover,
  LoadAccountByPassRecoveryCode
} from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel, mockRecoverPassInfo } from '@tests/domain/mocks'
import { Authentication, AuthenticationParams } from '@/domain/usecases/authentication'

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

export const mockLoadIdByEmail = (): LoadIdByEmail => {
  class LoadIdByEmailStub implements LoadIdByEmailStub {
    async load (params: LoadIdByEmail.Params): Promise<LoadIdByEmail.Result> {
      return Promise.resolve(mockAccountModel().id)
    }
  }
  return new LoadIdByEmailStub()
}

export const mockLoadAccountByPassRecoveryCode = (): LoadAccountByPassRecoveryCode => {
  class LoadAccountByPassRecoveryCodeStub implements LoadAccountByPassRecoveryCodeStub {
    async load (params: LoadAccountByPassRecoveryCode.Params): Promise<LoadAccountByPassRecoveryCode.Result> {
      return Promise.resolve({ ...mockAccountModel(), recoverPassInfo: { ...mockRecoverPassInfo() } })
    }
  }
  return new LoadAccountByPassRecoveryCodeStub()
}

export const mockUpdateAccount = (): UpdateAccount => {
  class UpdateAccountStub implements UpdateAccount {
    async update (params: UpdateAccount.Params): Promise<UpdateAccount.Result> {
      return Promise.resolve(true)
    }
  }
  return new UpdateAccountStub()
}

export const mockDeleteAccount = (): DeleteAccount => {
  class DeleteAccountStub implements DeleteAccount {
    async delete (): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountStub()
}

export const mockPasswordRecover = (): PasswordRecover => {
  class PasswordRecoverStub implements PasswordRecover {
    async recover (params: PasswordRecover.Params): Promise<PasswordRecover.Result> {
      return Promise.resolve(true)
    }
  }
  return new PasswordRecoverStub()
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}
