import { AccountModel } from '@/domain/models'
import { mockAccountModel, mockAccountsModel } from '@tests/domain/mocks'
import {
  AddAccountRepository,
  UpdateAccountRepository,
  UpdatePasswordRepository,
  LoadAccountByCodeRepository,
  DeleteAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  LoadAllAccountsRepository,
  UpdateAccessTokenRepository,
  AddFavouritePostRepository,
  RemoveFavouritePostRepository
} from '@/data/protocols'

export const mockAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountStubRepository implements AddAccountRepository {
    async addAccount (params: AddAccountRepository.Params): AddAccountRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new AddAccountStubRepository()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (params: LoadAccountByEmailRepository.Params): LoadAccountByEmailRepository.Result {
      const account: AccountModel = mockAccountModel()
      return Promise.resolve(account)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (params: LoadAccountByTokenRepository.Params): LoadAccountByTokenRepository.Result {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockLoadAllAccountsRepository = (): LoadAllAccountsRepository => {
  class LoadAllAccountsRepositoryStub implements LoadAllAccountsRepository {
    async loadAll (): LoadAllAccountsRepository.Result {
      return Promise.resolve(mockAccountsModel())
    }
  }
  return new LoadAllAccountsRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (params: UpdateAccessTokenRepository.Params): UpdateAccessTokenRepository.Result {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const mockAddFavouritePostRepository = (): AddFavouritePostRepository => {
  class AddFavouritePostRepositoryStub implements AddFavouritePostRepository {
    async addFavourite (params: AddFavouritePostRepository.Params): AddFavouritePostRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new AddFavouritePostRepositoryStub()
}

export const mockRemoveFavouritePostRepository = (): RemoveFavouritePostRepository => {
  class RemoveFavouritePostRepositoryStub implements RemoveFavouritePostRepository {
    async removeFavourite (params: RemoveFavouritePostRepository.Params): RemoveFavouritePostRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new RemoveFavouritePostRepositoryStub()
}

export const mockUpdateAccountRepository = (): UpdateAccountRepository => {
  class UpdateAccountRepositoryStub implements UpdateAccountRepository {
    async updateAccount (params: UpdateAccountRepository.Params): UpdateAccountRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new UpdateAccountRepositoryStub()
}

export const mockUpdatePasswordRepository = (): UpdatePasswordRepository => {
  class UpdatePasswordRepositoryStub implements UpdatePasswordRepository {
    async updatePassword (params: UpdatePasswordRepository.Params): UpdatePasswordRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new UpdatePasswordRepositoryStub()
}

export const mockLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (params: LoadAccountByIdRepository.Params): LoadAccountByIdRepository.Result {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByIdRepositoryStub()
}

export const mockLoadAccountByCodeRepository = (): LoadAccountByCodeRepository => {
  class LoadAccountByCodeRepositoryStub implements LoadAccountByCodeRepository {
    async loadByCode (params: LoadAccountByCodeRepository.Params): LoadAccountByCodeRepository.Result {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByCodeRepositoryStub()
}

export const mockDeleteAccountRepository = (): DeleteAccountRepository => {
  class DeleteAccountRepositoryStub implements DeleteAccountRepository {
    async deleteAccount (params: DeleteAccountRepository.Params): DeleteAccountRepository.Result {
      return Promise.resolve(true)
    }
  }
  return new DeleteAccountRepositoryStub()
}

// repo params are diff thant db params, so we need to use a diff mock
export const mockAccountRepositoryParams = (): AddAccountRepository.Params[] => (
  [
    {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      doc: 'cpf_or_cnpj',
      birthDate: '00/00/0000',
      phone: 'any_phone',
      profiles: ['any_profile', 'other_profile'],
      profilePhoto: 'any_photo_link',
      adress: {
        cep: 'any_cep',
        endereco: 'any_endereco',
        complemento: 'any_complemento',
        uf: 'any_uf',
        cidade: 'any_cidade',
        bairro: 'any_bairro'
      }
    },
    {
      name: 'other_name',
      email: 'other_email@mail.com',
      password: 'other_password',
      doc: 'cpf_or_cnpj',
      birthDate: '00/00/0000',
      phone: 'other_phone',
      profiles: ['other_profile', 'other_profile'],
      profilePhoto: 'other_photo_link',
      adress: {
        cep: 'other_cep',
        endereco: 'other_endereco',
        complemento: 'other_complemento',
        uf: 'other_uf',
        cidade: 'other_cidade',
        bairro: 'other_bairro'
      }
    }
  ]
)
