import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id'
import { LoadAccountByIdController } from './load-account-by-id'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { mockLoadAccountById, mockAccountModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { HttpRequest } from '@/presentation/protocols'

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

  test('Should return 204 LoadAccountById returns empty', async () => {
    const { sut, LoadAccountByIdStub } = makeSut()
    jest.spyOn(LoadAccountByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadAccountById throws', async () => {
    const { sut, LoadAccountByIdStub } = makeSut()
    jest.spyOn(LoadAccountByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
