import MockDate from 'mockdate'
import { LoadAccountByCode } from '@/domain/usecases'
import { CheckCodeController } from '@/presentation/controllers'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { mockLoadAccountByCode, mockValidation } from '@tests/presentation/mocks'
import { InvalidCodeError } from '@/presentation/errors'
import { mockCodeExpiration, mockCodeMatches } from '@tests/presentation/mocks/mock-confirmation-code-validator'
import { CodeExpiration, CodeMatches } from '@/validation/protocols'
import { mockAccountModel, throwError } from '@tests/domain/mocks'

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

type Body = { code: number }
const mockRequest = (): HttpRequest<Body> => ({
  body: {
    code: 999999
  },
  params: {
    id: 'any_id'
  }
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
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
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
    await sut.handle(mockRequest())
    const { code } = mockRequest().body
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
