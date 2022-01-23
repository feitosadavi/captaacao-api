import MockDate from 'mockdate'

import { LoadCarByIdController } from './load-car-by-id'
import { LoadCarById } from '@/domain/usecases/car/load-car-by-id'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'

import { mockCarsModel, throwError } from '@tests/domain/mocks'
import { mockLoadCarById } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadCarByIdController
  LoadCarByIdStub: LoadCarById
}

const mockRequest = (): HttpRequest => (
  {
    params: {
      id: 'any_id'
    }
  }
)

const makeSut = (): SutTypes => {
  const LoadCarByIdStub = mockLoadCarById()
  const sut = new LoadCarByIdController(LoadCarByIdStub)
  return {
    sut,
    LoadCarByIdStub
  }
}

describe('LoadCar Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadCarById with correct id', async () => {
    const { sut, LoadCarByIdStub } = makeSut()
    const loadCarByIdSpy = jest.spyOn(LoadCarByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadCarByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())// ATENÇÃO
    expect(httpResponse).toEqual(serverSuccess(mockCarsModel()[0]))
  })

  test('Should 204 LoadCarById returns empty', async () => {
    const { sut, LoadCarByIdStub } = makeSut()
    jest.spyOn(LoadCarByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadCarById throws', async () => {
    const { sut, LoadCarByIdStub } = makeSut()
    jest.spyOn(LoadCarByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
