import MockDate from 'mockdate'

import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, serverError, serverSuccess } from '@/presentation/helpers'
import { AuthMiddleware } from '@/presentation/middlewares'

import { mockAccountModel, throwError } from '@tests/domain/mocks'
import { mockLoadAccountByToken } from '@tests/presentation/mocks'

const mockRequest = (): AuthMiddleware.Request => {
  return {
    accessToken: 'any_token'
  }
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (profiles?: string[]): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, profiles)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should 403 if no x-access-token exists in headers ', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken ', async () => {
    const profiles = ['any_profile']
    const { sut, loadAccountByTokenStub } = makeSut(profiles)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith({ accessToken: 'any_token', profiles })
  })

  test('Should return 403 if LoadAccountByToken returns null ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should 200 on id verification success', async () => {
    const profiles = ['any_profile']
    const { loadAccountByTokenStub } = makeSut(profiles)
    const sut = new AuthMiddleware(loadAccountByTokenStub, profiles)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    loadSpy.mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverSuccess({ accountId: 'any_id' }))
  })

  test('Should return 200 if LoadAccountByToken returns an account ', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ accountId: 'any_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
