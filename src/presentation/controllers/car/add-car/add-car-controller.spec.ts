import MockDate from 'mockdate'

import { Validation, HttpRequest, AddCar } from './add-car-protocols'
import { AddCarController } from './add-car-controller'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'

import { mockCarsParams } from '@tests/domain/mocks'
import { mockAddCar } from '@tests/presentation/mocks'
import { mockValidation, throwError } from '@/domain/test'

const mockRequest = (): HttpRequest => ({
  body: {
    ...mockCarsParams()[0]
  }
})

type SutTypes = {
  sut: AddCarController
  validationStub: Validation
  addCarStub: AddCar
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addCarStub = mockAddCar()
  const sut = new AddCarController(validationStub, addCarStub)
  return {
    sut,
    validationStub,
    addCarStub
  }
}
describe('AddCar Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddCar with correct values', async () => {
    const { sut, addCarStub } = makeSut()
    const addSpy = jest.spyOn(addCarStub, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddCar throws', async () => {
    const { sut, addCarStub } = makeSut()
    jest.spyOn(addCarStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
