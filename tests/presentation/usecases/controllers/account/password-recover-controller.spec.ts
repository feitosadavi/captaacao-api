import { LoadIdByEmail, PasswordRecover } from '@/domain/usecases'
import { PasswordRecoverController } from '@/presentation/controllers/account/password-recover-controller'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { UnknownError } from '@/presentation/errors/unknown-error'

import { throwError } from '@tests/domain/mocks'
import { mockLoadIdByEmail, mockPasswordRecover, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: PasswordRecoverController
  validationStub: Validation
  loadIdByEmailStub: LoadIdByEmail
  passwordRecoverStub: PasswordRecover
}

const mockRequest = (): HttpRequest => (
  {
    body: {
      email: 'any_email@mail.com'
    }
  }
)

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const loadIdByEmailStub = mockLoadIdByEmail()
  const passwordRecoverStub = mockPasswordRecover()
  const sut = new PasswordRecoverController(
    validationStub,
    loadIdByEmailStub,
    passwordRecoverStub
  )
  return {
    sut,
    validationStub,
    loadIdByEmailStub,
    passwordRecoverStub
  }
}

describe('PasswordRecover Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body.email)
  })

  test('Should call LoadIdByEmail with correct id', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    const loadSpy = jest.spyOn(loadIdByEmailStub, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toHaveBeenCalledWith({ email: mockRequest().body.email })
  })

  test('Should return 400 if LoadIdByEmail dont find any account', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    jest.spyOn(loadIdByEmailStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new NotFoundAccountError()))
  })

  test('Should call PasswordRecover with correct params', async () => {
    const { sut, passwordRecoverStub } = makeSut()
    const updateSpy = jest.spyOn(passwordRecoverStub, 'recover')
    await sut.handle(mockRequest())
    expect(updateSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      id: 'any_id'
    })
  })

  test('Should return 400 if PasswordRecover returns false', async () => {
    const { sut, passwordRecoverStub } = makeSut()
    jest.spyOn(passwordRecoverStub, 'recover').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new UnknownError('password recover')))
  })

  test('Should return 500 if PasswordRecover throws', async () => {
    const { sut, passwordRecoverStub } = makeSut()
    jest.spyOn(passwordRecoverStub, 'recover').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ id: 'any_id' }))
  })
})
