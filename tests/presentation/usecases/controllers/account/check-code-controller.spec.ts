import MockDate from 'mockdate'
import { LoadAccountByCode } from '@/domain/usecases'
import { CheckCodeController } from '@/presentation/controllers'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { Validation } from '@/presentation/protocols'
import { InvalidCodeError } from '@/presentation/errors'
import { CodeExpiration, CodeMatches } from '@/validation/protocols'

import { mockCodeExpiration, mockCodeMatches } from '@tests/presentation/mocks/mock-confirmation-code-validator'
import { mockAccountModel, throwError } from '@tests/domain/mocks'
import { mockLoadAccountByCode, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: CheckCodeController
  validationStub: Validation
  loadByCode: LoadAccountByCode
  codeMatchesStub: CodeMatches
  codeExpirationStub: CodeExpiration
}
const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const loadByCode = mockLoadAccountByCode()
  const codeExpirationStub = mockCodeExpiration()
  const codeMatchesStub = mockCodeMatches()
  const sut = new CheckCodeController(validationStub, loadByCode, codeMatchesStub, codeExpirationStub)
  return {
    sut,
    validationStub,
    loadByCode,
    codeMatchesStub,
    codeExpirationStub
  }
}

const mockRequest = (): CheckCodeController.Request => ({
  code: 999999
})

describe('UpdateAccount Controller', () => {
  // preciso do mock date para que os codes não expirem
  beforeAll(() => {
    MockDate.set(new Date('2011-04-11T11:51:00'))
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call loadByCode with with correct values', async () => {
    const { sut, loadByCode } = makeSut()
    const loadByPasCodeSpy = jest.spyOn(loadByCode, 'load')
    const request = mockRequest()
    await sut.handle(request)
    const { code } = request
    expect(loadByPasCodeSpy).toHaveBeenCalledWith({ code })
  })

  test('Should return 400 if loadByCode returns null', async () => {
    const { sut, loadByCode } = makeSut()
    jest.spyOn(loadByCode, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidCodeError()))
  })

  test('Should return 400 if loadByCode returns an account without recovery code', async () => {
    const { sut, loadByCode } = makeSut()
    jest.spyOn(loadByCode, 'load').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidCodeError()))
  })

  test('Should return 500 if loadByCode throws', async () => {
    const { sut, loadByCode } = makeSut()
    jest.spyOn(loadByCode, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if CodeMatches returns false', async () => {
    const { sut, codeMatchesStub } = makeSut()
    jest.spyOn(codeMatchesStub, 'matches').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidCodeError()))
  })

  test('Should return 400 if CodeExpiration returns false', async () => {
    const { sut, codeExpirationStub } = makeSut()
    jest.spyOn(codeExpirationStub, 'isExpired').mockReturnValueOnce(true)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidCodeError()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })
})
