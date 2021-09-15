import { LoadAccounts, LoadAccountByToken, HttpRequest } from './load-accounts-controller-protocols'
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
})
