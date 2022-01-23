import MockDate from 'mockdate'

import { LoadCarsController } from './load-cars'
import { LoadCars } from '@/domain/usecases/car/load-cars'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'

import { mockCarsModel, throwError } from '@tests/domain/mocks'
import { mockLoadCars } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadCarsController
  loadCarsStub: LoadCars
}

const makeSut = (): SutTypes => {
  const loadCarsStub = mockLoadCars()
  const sut = new LoadCarsController(loadCarsStub)
  return {
    sut,
    loadCarsStub
  }
}

describe('LoadCar Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadCars', async () => {
    const { sut, loadCarsStub } = makeSut()
    const loadCarsSpy = jest.spyOn(loadCarsStub, 'load')
    await sut.handle({})
    expect(loadCarsSpy).toHaveBeenCalled()
  })

  test('Should 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverSuccess(mockCarsModel()))
  })

  test('Should 204 LoadCars returns empty', async () => {
    const { sut, loadCarsStub } = makeSut()
    jest.spyOn(loadCarsStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadCars throws', async () => {
    const { sut, loadCarsStub } = makeSut()
    jest.spyOn(loadCarsStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
