import { DbAddAccount } from './db-add-account'
import { Hasher, AccountModel, AddAccountRepository } from './db-add-account-protocols'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { mockHasher } from '@/domain/test'
import { mockAccountModel, mockAccountParams } from '@tests/domain/mocks'
import { mockAddAccountRepositoryStub } from '@tests/data/mocks/mock-db-account'

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepository implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      // aqui o caso de sucesso é quando retorna null, pois signica que ainda não existe o email inserido
      // por isso não usarei o helper, pois ele retorna uma conta
      return Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepository()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepositoryStub()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherStub } = makeSut()
    const addAccountParams = mockAccountParams()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(addAccountParams)
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAccountParams()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = { ...mockAccountParams(), password: 'hashed_password' } // add should be called with a hashed password
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('Should DbAddAccount throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAccountParams()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAccountParams())
    expect(account).toEqual(true)
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return false if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(mockAccountParams())
    expect(account).toBe(false)
  })
})
