import MockDate from 'mockdate'

import { DbLoadAllAccounts } from '@/data/usecases'
import { LoadAllAccountsRepository } from '@/data/protocols'

import { mockLoadAllAccountsRepository } from '@tests/data/mocks'
import { mockAccountsModel, throwError } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAllAccounts
  loadAccountsRepositoryStub: LoadAllAccountsRepository
}

const makeSut = (): SutTypes => {
  const loadAccountsRepositoryStub = mockLoadAllAccountsRepository()
  const sut = new DbLoadAllAccounts(loadAccountsRepositoryStub)
  return {
    sut,
    loadAccountsRepositoryStub
  }
}

describe('DbLoadAllAccounts', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAllAccountsRepository', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAccountsRepositoryStubSpy).toHaveBeenCalled()
  })

  test('Should throw if LoadAllAccountsRepository throws', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAll')
    loadAccountsRepositoryStubSpy.mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return account array if LoadAllAccountsRepository return account array', async () => {
    const { sut } = makeSut()
    const accounts = await sut.load()
    expect(accounts).toEqual(mockAccountsModel())
  })

  test('Should return null if LoadAllAccountsRepository return null', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAll')
    loadAccountsRepositoryStubSpy.mockReturnValueOnce(Promise.resolve(null))
    const accounts = await sut.load()
    expect(accounts).toBeNull()
  })
})
