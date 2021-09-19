import { LoadAccounts, HttpRequest } from './load-accounts-controller-protocols'
import { LoadAccountsController } from './load-accounts-controller'
import { mockAccountModel, mockLoadAccounts, throwError } from '@/domain/test'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'

type SutTypes = {
  sut: LoadAccountsController
  loadAccountsStub: LoadAccounts
}

const makeSut = (): SutTypes => {
  const loadAccountsStub = mockLoadAccounts()
  const sut = new LoadAccountsController(loadAccountsStub)
  return {
    sut,
    loadAccountsStub
  }
}
const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_acess_token'
  }
})

describe('Load Accounts Controller', () => {
  test('Should call loadAccounts', async () => {
    const { sut, loadAccountsStub } = makeSut()
    const loadAccountsStubSpy = jest.spyOn(loadAccountsStub, 'load')
    await sut.handle(mockRequest())
    expect(loadAccountsStubSpy).toHaveBeenCalled()
  })
  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess([mockAccountModel()]))
  })
  test('Should return 204 if loadAccounts doesnt find any accounts', async () => {
    const { sut, loadAccountsStub } = makeSut()
    const loadAccountsStubSpy = jest.spyOn(loadAccountsStub, 'load')
    loadAccountsStubSpy.mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
  test('Should return 500 if loadAccounts throws', async () => {
    const { sut, loadAccountsStub } = makeSut() // should throw if throws
    const loadAccountsStubSpy = jest.spyOn(loadAccountsStub, 'load')
    loadAccountsStubSpy.mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
