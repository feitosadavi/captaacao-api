import { DbLoadAccounts } from './db-load-accounts'
import { LoadAccountsRepository } from './db-load-accounts-protocols'
import { mockAccountModel, mockLoadAccounts } from '@/domain/test/mock-account-repository'

type SutTypes = {
  sut: DbLoadAccounts
  loadAccountsRepositoryStub: LoadAccountsRepository
}

const makeSut = (): SutTypes => {
  const loadAccountsRepositoryStub = mockLoadAccounts()
  const sut = new DbLoadAccounts(loadAccountsRepositoryStub)
  return {
    sut,
    loadAccountsRepositoryStub
  }
}

describe('DbLoadAccounts', () => {
  test('Should call LoadAccountsRepository', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAccounts')
    await sut.load()
    expect(loadAccountsRepositoryStubSpy).toHaveBeenCalled()
  })

  test('Should return account array if LoadAccountsRepository return account array', async () => {
    const { sut } = makeSut()
    const accounts = await sut.load()
    expect(accounts).toEqual([mockAccountModel()])
  })
})
