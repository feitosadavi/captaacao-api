import MockDate from 'mockdate'
import { LoadAccountByPassRecoveryCode } from '@/domain/usecases'
import { ValidatePassRecoverCode } from '@/presentation/controllers'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { mockLoadAccountByPassRecoveryCode, mockValidation } from '@tests/presentation/mocks'
import { InvalidPasswordRecoveryCodeError } from '@/presentation/errors'
import { mockCodeExpiration, mockCodeMatches } from '@tests/presentation/mocks/mock-confirmation-code-validator'
import { CodeExpiration, CodeMatches } from '@/validation/protocols'
import { mockAccountModel, throwError } from '@tests/domain/mocks'

type SutTypes = {
  sut: ValidatePassRecoverCode
  validationStub: Validation
  loadByPassRecoveryCode: LoadAccountByPassRecoveryCode
  codeMatchesStub: CodeMatches
  codeExpirationStub: CodeExpiration
}
const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const loadByPassRecoveryCode = mockLoadAccountByPassRecoveryCode()
  const codeExpirationStub = mockCodeExpiration()
  const codeMatchesStub = mockCodeMatches()
  const sut = new ValidatePassRecoverCode(validationStub, loadByPassRecoveryCode, codeMatchesStub, codeExpirationStub)
  return {
    sut,
    validationStub,
    loadByPassRecoveryCode,
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

  test('Should call loadByPassRecoveryCode with with correct values', async () => {
    const { sut, loadByPassRecoveryCode } = makeSut()
    const loadByPassRecoveryCodeSpy = jest.spyOn(loadByPassRecoveryCode, 'load')
    await sut.handle(mockRequest())
    const { code } = mockRequest().body
    expect(loadByPassRecoveryCodeSpy).toHaveBeenCalledWith({ code })
  })

  test('Should return 400 if loadByPassRecoveryCode returns null', async () => {
    const { sut, loadByPassRecoveryCode } = makeSut()
    jest.spyOn(loadByPassRecoveryCode, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidPasswordRecoveryCodeError()))
  })

  test('Should return 400 if loadByPassRecoveryCode returns an account without recovery code', async () => {
    const { sut, loadByPassRecoveryCode } = makeSut()
    jest.spyOn(loadByPassRecoveryCode, 'load').mockReturnValueOnce(Promise.resolve(mockAccountModel()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidPasswordRecoveryCodeError()))
  })

  test('Should return 500 if loadByPassRecoveryCode throws', async () => {
    const { sut, loadByPassRecoveryCode } = makeSut()
    jest.spyOn(loadByPassRecoveryCode, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 400 if CodeMatches returns false', async () => {
    const { sut, codeMatchesStub } = makeSut()
    jest.spyOn(codeMatchesStub, 'matches').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidPasswordRecoveryCodeError()))
  })

  test('Should return 400 if CodeExpiration returns false', async () => {
    const { sut, codeExpirationStub } = makeSut()
    jest.spyOn(codeExpirationStub, 'isExpired').mockReturnValueOnce(true)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidPasswordRecoveryCodeError()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })
})
