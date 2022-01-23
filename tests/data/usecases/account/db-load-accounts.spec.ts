import MockDate from 'mockdate'

import { DbLoadAccounts } from '@/data/usecases'
import { LoadAccountsRepository } from '@/data/protocols'

import { mockLoadAccountsRepository } from '@tests/data/mocks'
import { mockAccountsModel, throwError } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAccounts
  loadAccountsRepositoryStub: LoadAccountsRepository
}

const makeSut = (): SutTypes => {
  const loadAccountsRepositoryStub = mockLoadAccountsRepository()
  const sut = new DbLoadAccounts(loadAccountsRepositoryStub)
  return {
    sut,
    loadAccountsRepositoryStub
  }
}

describe('DbLoadAccounts', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAccountsRepository', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAccounts')
    await sut.load()
    expect(loadAccountsRepositoryStubSpy).toHaveBeenCalled()
  })

  test('Should throw if LoadAccountsRepository throws', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAccounts')
    loadAccountsRepositoryStubSpy.mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return account array if LoadAccountsRepository return account array', async () => {
    const { sut } = makeSut()
    const accounts = await sut.load()
    expect(accounts).toEqual(mockAccountsModel())
  })

  test('Should return null if LoadAccountsRepository return null', async () => {
    const { sut, loadAccountsRepositoryStub } = makeSut()
    const loadAccountsRepositoryStubSpy = jest.spyOn(loadAccountsRepositoryStub, 'loadAccounts')
    loadAccountsRepositoryStubSpy.mockReturnValueOnce(Promise.resolve(null))
    const accounts = await sut.load()
    expect(accounts).toBeNull()
  })
})
