import { LoadAccountByPassRecoveryCode } from '@/domain/usecases'
import { ValidatePassRecoverCode } from '@/presentation/controllers'
import { badRequest, serverError } from '@/presentation/helpers'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { throwError } from '@tests/domain/mocks'
import { mockLoadAccountByPassRecoveryCode, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: ValidatePassRecoverCode
  validationStub: Validation
  loadByPassRecoveryCode: LoadAccountByPassRecoveryCode
}
const makeSut = (): SutTypes => {
  const loadByPassRecoveryCode = mockLoadAccountByPassRecoveryCode()
  const validationStub = mockValidation()
  const sut = new ValidatePassRecoverCode(validationStub, loadByPassRecoveryCode)
  return {
    sut,
    validationStub,
    loadByPassRecoveryCode
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

  test('Should return 400 loadByPassRecoveryCode if throws', async () => {
    const { sut, loadByPassRecoveryCode } = makeSut()
    jest.spyOn(loadByPassRecoveryCode, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
