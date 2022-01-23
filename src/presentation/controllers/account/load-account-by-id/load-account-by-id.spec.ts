import MockDate from 'mockdate'

import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id'
import { LoadAccountByIdController } from './load-account-by-id'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { HttpRequest } from '@/presentation/protocols'
import { mockAccountModel } from '@tests/domain/mocks'
import { mockLoadAccountById } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadAccountByIdController
  LoadAccountByIdStub: LoadAccountById
}

const mockRequest = (): HttpRequest => (
  {
    params: {
      id: 'any_id'
    }
  }
)

const makeSut = (): SutTypes => {
  const LoadAccountByIdStub = mockLoadAccountById()
  const sut = new LoadAccountByIdController(LoadAccountByIdStub)
  return {
    sut,
    LoadAccountByIdStub
  }
}

describe('LoadCar Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadAccountById with correct id', async () => {
    const { sut, LoadAccountByIdStub } = makeSut()
    const loadAccountByIdSpy = jest.spyOn(LoadAccountByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadAccountByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess(mockAccountModel()))
  })

  test('Should return 500 if LoadAccountById throws', async () => {
    const { sut, LoadAccountByIdStub } = makeSut()
    jest.spyOn(LoadAccountByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
