import { LoadAccountById } from '@/domain/usecases'
import { ValidatePassRecoverCode } from '@/presentation/controllers'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { mockLoadAccountById, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: ValidatePassRecoverCode
  validationStub: Validation
  loadAccountByIdStub: LoadAccountById
}
const makeSut = (): SutTypes => {
  const loadAccountByIdStub = mockLoadAccountById()
  const validationStub = mockValidation()
  const sut = new ValidatePassRecoverCode(validationStub, loadAccountByIdStub)
  return {
    sut,
    validationStub,
    loadAccountByIdStub
  }
}
const mockRequest = (): HttpRequest => ({
  body: {
    code: 999999
  }
})

describe('UpdateAccount Controller', () => {
  test('Should call Validation with correct values ', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })
})
