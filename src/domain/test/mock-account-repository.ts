import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { DeleteAccountRepository } from '@/data/protocols/db/account/delete-account-repository'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByIdRepository } from '@/data/protocols/db/account/load-account-by-id-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { LoadAccountsRepository } from '@/data/protocols/db/account/load-accounts-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export const mockAccountParams = (): AddAccountParams => {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    cpf: 'any_cpf',
    birthDate: '00/00/0000',
    phoneNumber: '9999999999999',
    role: 'any_role'
  }
}

export const mockAccountModel = (): AccountModel => {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
    cpf: 'any_cpf',
    birthDate: '00/00/0000',
    phoneNumber: '9999999999999',
    role: 'any_role'
  }
}

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryStub()
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
      return Promise.resolve([mockAccountModel()])
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

export const mockLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

export const mockDeleteAccountRepository = (): DeleteAccountRepository => {
  class DeleteAccountRepositoryStub implements DeleteAccountRepository {
    async deleteAccount (id: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountRepositoryStub()
}
