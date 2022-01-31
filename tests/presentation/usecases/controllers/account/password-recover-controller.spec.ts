import env from '@/main/config/env'
import { SendEmail } from '@/data/protocols'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { UpdateAccount, LoadIdByEmail } from '@/domain/usecases'
import { PasswordRecoverController } from '@/presentation/controllers/account/password-recover-controller'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { makePasswordRecoverMail } from '@/presentation/helpers/email'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { UnknownError } from '@/presentation/errors/unknown-error'

import { mockRecoverPassInfo, throwError } from '@tests/domain/mocks'
import { mockGeneratePassRecoverInfoStub, mockLoadIdByEmail, mockSendEmail, mockUpdateAccount, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: PasswordRecoverController
  validationStub: Validation
  loadIdByEmailStub: LoadIdByEmail
  updateAccountStub: UpdateAccount
  generatePassRecoverInfoStub: GeneratePassRecoverInfo
  sendEmailStub: SendEmail
}

const mockRequest = (): HttpRequest => (
  {
    body: {
      email: 'any_email@mail.com'
    }
  }
)

const mockUpdateAccountParams = (): UpdateAccount.Params => ({
  id: 'any_id',
  fields: { recoverPassInfo: mockRecoverPassInfo() }
})

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const loadIdByEmailStub = mockLoadIdByEmail()
  const updateAccountStub = mockUpdateAccount()
  const sendEmailStub = mockSendEmail()
  const generatePassRecoverInfoStub = mockGeneratePassRecoverInfoStub()
  const sut = new PasswordRecoverController(
    validationStub,
    loadIdByEmailStub,
    updateAccountStub,
    generatePassRecoverInfoStub,
    sendEmailStub
  )
  return {
    sut,
    validationStub,
    loadIdByEmailStub,
    updateAccountStub,
    generatePassRecoverInfoStub,
    sendEmailStub
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

  test('Should call GeneratePassRecoverInfoStub', async () => {
    const { sut, generatePassRecoverInfoStub } = makeSut()
    const generateSpy = jest.spyOn(generatePassRecoverInfoStub, 'generate')
    await sut.handle(mockRequest())
    expect(generateSpy).toHaveBeenCalled()
  })

  test('Should call UpdateAccount with correct params', async () => {
    const { sut, updateAccountStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountStub, 'update')
    await sut.handle(mockRequest())
    expect(updateSpy).toHaveBeenCalledWith(mockUpdateAccountParams())
  })

  test('Should return 400 if UpdateAccount returns false', async () => {
    const { sut, updateAccountStub } = makeSut()
    jest.spyOn(updateAccountStub, 'update').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new UnknownError('update account')))
  })

  test('Should call SendEmail with correct params', async () => {
    const { sut, sendEmailStub } = makeSut()
    const sendSpy = jest.spyOn(sendEmailStub, 'send')
    await sut.handle(mockRequest())
    expect(sendSpy).toHaveBeenCalledWith(makePasswordRecoverMail(env.recEmail, mockRequest().body.email, mockRecoverPassInfo().code))
  })

  test('Should return 400 if SendEmail returns false', async () => {
    const { sut, sendEmailStub } = makeSut()
    jest.spyOn(sendEmailStub, 'send').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new UnknownError('send email')))
  })

  test('Should return 500 if LoadIdByEmail throws', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    jest.spyOn(loadIdByEmailStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ id: 'any_id' }))
  })
})
