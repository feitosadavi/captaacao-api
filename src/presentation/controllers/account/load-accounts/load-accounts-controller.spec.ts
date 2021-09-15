import { LoadAccounts, LoadAccountByToken, HttpRequest, forbidden, AccessDeniedError } from './load-accounts-controller-protocols'
import { LoadAccountsController } from './load-accounts-controller'
import { mockLoadAccountByToken, mockLoadAccounts } from '@/domain/test'

type SutTypes = {
  sut: LoadAccountsController
  loadAccountsStub: LoadAccounts
  loadAccountByToken: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountsStub = mockLoadAccounts()
  const loadAccountByToken = mockLoadAccountByToken()
  const sut = new LoadAccountsController(loadAccountsStub, loadAccountByToken)
  return {
    sut,
    loadAccountsStub,
    loadAccountByToken
  }
}
const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_acess_token'
  }
})

describe('Load Accounts Controller', () => {
  test('Should call loadAccountByToken with correct params', async () => {
    const { sut, loadAccountByToken } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByToken, 'load')
    await sut.handle(mockRequest())
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any_acess_token')
  })
  test('Should return 403 if token is invalid or was not provided', async () => {
    const { sut, loadAccountByToken } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByToken, 'load')
    loadAccountByTokenSpy.mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('Should call loadAccounts', async () => {
    const { sut, loadAccountsStub } = makeSut()
    const loadAccountsStubSpy = jest.spyOn(loadAccountsStub, 'load')
    await sut.handle(mockRequest())
    expect(loadAccountsStubSpy).toHaveBeenCalled()
  })
})
