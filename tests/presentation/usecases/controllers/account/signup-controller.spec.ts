import MockDate from 'mockdate'

import { AddAccount, Authentication } from '@/domain/usecases'
import { SignUpController } from '@/presentation/controllers/account'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { badRequest, serverError, serverSuccess, forbidden } from '@/presentation/helpers'
import { Validation } from '@/presentation/protocols'

import { mockAccountModel, mockAccountParams, throwError } from '@tests/domain/mocks'
import { mockAddAccountStub, mockAuthentication, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccountStub()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const mockRequest = (): SignUpController.Request => {
  const { profilePhoto, ...accountParams } = mockAccountParams()
  return {
    ...accountParams,
    clientFiles: [{
      fileName: 'any_photo_link',
      buffer: Buffer.from('any'),
      mimeType: 'any_mime_type'
    }]
  }
}

describe('SignUp Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call AddAccount without profilePhoto if request has no clientFiles', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const { clientFiles, ...request } = mockRequest()
    await sut.handle(request)

    const { profilePhoto, ...addParamsWithoutProfilePhoto } = mockAccountParams()
    expect(addSpy).toHaveBeenCalledWith(addParamsWithoutProfilePhoto)
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = mockRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith(mockAccountParams())
  })

  test('Should return 200 and accessToken if valid data is provided', async () => {
    const { sut } = makeSut()
    const accountWithToken = await sut.handle(mockRequest())
    expect(accountWithToken).toEqual(serverSuccess(mockAccountModel()))
  })

  test('Should return 403 if an email already in use is provided', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null)) // mockar para retornar false
    const accountWithToken = await sut.handle(mockRequest())

    expect(accountWithToken).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct value', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
