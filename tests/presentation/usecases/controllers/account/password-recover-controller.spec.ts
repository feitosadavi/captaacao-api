import env from '@/main/config/env'
import { SendEmail } from '@/data/protocols'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { UpdateAccount, LoadIdByEmail } from '@/domain/usecases'
import { PasswordRecoverController } from '@/presentation/controllers/account/password-recover-controller'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { makePasswordRecoverMail } from '@/presentation/helpers/email'
import { badRequest, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { mockRecoverPassInfo, throwError } from '@tests/domain/mocks'

import { mockGeneratePassRecoverInfoStub, mockLoadIdByEmail, mockSendEmail, mockUpdateAccount } from '@tests/presentation/mocks'

type SutTypes = {
  sut: PasswordRecoverController
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
  const loadIdByEmailStub = mockLoadIdByEmail()
  const updateAccountStub = mockUpdateAccount()
  const sendEmailStub = mockSendEmail()
  const generatePassRecoverInfoStub = mockGeneratePassRecoverInfoStub()
  const sut = new PasswordRecoverController(loadIdByEmailStub, updateAccountStub, generatePassRecoverInfoStub, sendEmailStub)
  return {
    sut,
    loadIdByEmailStub,
    updateAccountStub,
    generatePassRecoverInfoStub,
    sendEmailStub
  }
}

describe('PasswordRecover Controller', () => {
  test('Should call LoadIdByEmail with correct id', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    const loadAccountByIdSpy = jest.spyOn(loadIdByEmailStub, 'load')
    await sut.handle(mockRequest())
    expect(loadAccountByIdSpy).toHaveBeenCalledWith({ email: mockRequest().body.email })
  })

  test('Should return 400 if LoadIdByEmail dont find any account', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    jest.spyOn(loadIdByEmailStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new NotFoundAccountError()))
  })

  test('Should call GeneratePassRecoverInfoStub', async () => {
    const { sut, generatePassRecoverInfoStub } = makeSut()
    const generatePassRecoverInfoSpy = jest.spyOn(generatePassRecoverInfoStub, 'generate')
    await sut.handle(mockRequest())
    expect(generatePassRecoverInfoSpy).toHaveBeenCalled()
  })

  test('Should call UpdateAccount with correct params', async () => {
    const { sut, updateAccountStub } = makeSut()
    const updateAccountSpy = jest.spyOn(updateAccountStub, 'update')
    await sut.handle(mockRequest())
    expect(updateAccountSpy).toHaveBeenCalledWith(mockUpdateAccountParams())
  })

  test('Should call SendEmail with correct params', async () => {
    const { sut, sendEmailStub } = makeSut()
    const sendEmailSpy = jest.spyOn(sendEmailStub, 'send')
    await sut.handle(mockRequest())
    expect(sendEmailSpy).toHaveBeenCalledWith(makePasswordRecoverMail(env.recEmail, mockRequest().body.email, mockRecoverPassInfo().code))
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
