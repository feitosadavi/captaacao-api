import { DeleteAccountRepository } from '@/data/protocols/db/account/delete-account-repository'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountsRepository } from '@/data/protocols/db/account/load-accounts-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { mockAccountModel, mockAccountsModel } from '@tests/domain/mocks'
import { AddAccountRepository, UpdateAccountRepository, UpdatePasswordRepository, LoadAccountByCodeRepository } from '@/data/protocols'

export const mockAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountStubRepository implements AddAccountRepository {
    // eslint-disable-next-line @typescript-eslint/require-await
    async add (params: AddAccountRepository.Params): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new AddAccountStubRepository()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      const account: AccountModel = mockAccountModel()
      return Promise.resolve(account)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockLoadAccountsRepository = (): LoadAccountsRepository => {
  class LoadAccountsRepositoryStub implements LoadAccountsRepository {
    async loadAccounts (): Promise<AccountModel[]> {
      return Promise.resolve(mockAccountsModel())
    }
  }
  return new LoadAccountsRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockUpdateAccountRepository = (): UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async updateAccount (params: UpdateAccountRepository.Params): Promise<UpdateAccountRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new UpdateAccountRepositoryStub()
}

export const mockUpdatePasswordRepository = (): UpdatePasswordRepository => {
  class UpdatePasswordRepositoryStub implements UpdatePasswordRepository {
    async updatePassword (params: UpdatePasswordRepository.Params): Promise<UpdatePasswordRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new UpdatePasswordRepositoryStub()
}

export const mockLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

export const mockLoadAccountByCodeRepository = (): LoadAccountByCodeRepository => {
  class LoadAccountByCodeRepositoryStub implements LoadAccountByCodeRepository {
    async loadByCode (params: LoadAccountByCodeRepository.Params): Promise<LoadAccountByCodeRepository.Result> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByCodeRepositoryStub()
}

export const mockDeleteAccountRepository = (): DeleteAccountRepository => {
  class DeleteAccountRepositoryStub implements DeleteAccountRepository {
    async deleteAccount (id: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountRepositoryStub()
}
