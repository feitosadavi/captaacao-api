import { LoadAccountByToken, HttpRequest } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors'
import { forbidden, serverError, serverSuccess } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { throwError } from '@/domain/test'
import { mockAccountModel } from '@tests/domain/mocks'
import { mockLoadAccountByToken } from '@tests/data/mocks'

const mockRequest = (): HttpRequest => {
  return {
    headers: {
      'x-access-token': 'any_token'
    },
    params: {
      id: 'any_id'
    }
  }
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string, checkId?: boolean): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role, checkId)
  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  test('Should 403 if user isnt admin or his id is not equal params id', async () => {
    const role = 'any_role'
    const { sut } = makeSut(role, true)
    const response = await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      },
      params: {
        id: 'other_id'
      }
    })
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should 403 if no x-access-token exists in headers ', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken ', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken returns null ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should 200 on id verification success', async () => {
    const role = 'any_role'
    const { loadAccountByTokenStub } = makeSut(role)
    const sut = new AuthMiddleware(loadAccountByTokenStub, role, true)
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
