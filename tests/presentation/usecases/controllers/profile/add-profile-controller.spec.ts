import MockDate from 'mockdate'

import { AddProfileController } from '@/presentation/controllers'
import { badRequest, serverError, noContent } from '@/presentation/helpers/http/http-helper'

import { mockProfileParams, throwError } from '@tests/domain/mocks'
import { mockAddProfile, mockValidation } from '@tests/presentation/mocks'
import { Validation } from '@/presentation/protocols'
import { AddProfile } from '@/domain/usecases'
import { NameInUseError } from '@/presentation/errors'

type SutTypes = {
  sut: AddProfileController
  validationStub: Validation
  addProfileStub: AddProfile
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addProfileStub = mockAddProfile()
  const sut = new AddProfileController(validationStub, addProfileStub)
  return {
    sut,
    validationStub,
    addProfileStub
  }
}

const mockRequest = (): AddProfileController.Request => ({ ...mockProfileParams() })

describe('AddProfile Controller', () => {
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
    expect(validateSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddProfile with correct values', async () => {
    const { sut, addProfileStub } = makeSut()
    const addSpy = jest.spyOn(addProfileStub, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return 400 if AddProfile returns false', async () => {
    const { sut, addProfileStub } = makeSut()
    jest.spyOn(addProfileStub, 'add').mockReturnValueOnce(Promise.resolve(false))
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NameInUseError()))
  })

  test('Should return 500 if AddProfile throws', async () => {
    const { sut, addProfileStub } = makeSut()
    jest.spyOn(addProfileStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
