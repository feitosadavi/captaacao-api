import env from '@/main/config/env'

import { PasswordRecover } from '@/domain/usecases'
import { UpdateAccountRepository, SendEmailRepository, SetupEmailRepository } from '@/data/protocols'
import { DbPasswordRecover } from '@/data/usecases'
import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { makePasswordRecoverMail } from '@/data/helpers'

import { mockUpdateAccountRepository, mockSendEmailRepository, mockSetupEmailRepository } from '@tests/data/mocks'
import { mockGeneratePassRecoverInfoStub } from '@tests/data/mocks/others'
import { mockAccountConfirmationCode } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbPasswordRecover
  updateAccountRepositoryStub: UpdateAccountRepository
  generatePassRecoverInfoStub: GeneratePassRecoverInfo
  sendEmailStub: SendEmailRepository
  setupEmailStub: SetupEmailRepository
}

const mockPasswordRecoverParams = (): PasswordRecover.Params => ({
  id: 'any_id',
  email: 'email@mail.com'
})

const makeSut = (): SutTypes => {
  const updateAccountRepositoryStub = mockUpdateAccountRepository()
  const generatePassRecoverInfoStub = mockGeneratePassRecoverInfoStub()
  const sendEmailStub = mockSendEmailRepository()
  const setupEmailStub = mockSetupEmailRepository()
  const sut = new DbPasswordRecover(
    updateAccountRepositoryStub,
    generatePassRecoverInfoStub,
    sendEmailStub,
    setupEmailStub
  )
  return {
    sut,
    updateAccountRepositoryStub,
    generatePassRecoverInfoStub,
    sendEmailStub,
    setupEmailStub
  }
}

describe('DbPasswordRecover Usecase', () => {
  test('Should call GeneratePassRecoverInfoStub', async () => {
    const { sut, generatePassRecoverInfoStub } = makeSut()
    const generateSpy = jest.spyOn(generatePassRecoverInfoStub, 'generate')
    await sut.recover(mockPasswordRecoverParams())
    expect(generateSpy).toHaveBeenCalled()
  })

  test('Should call UpdateAccountRepository with correct params', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'updateAccount')
    await sut.recover(mockPasswordRecoverParams())
    expect(updateSpy).toHaveBeenCalledWith({
      id: 'any_id',
      fields: { code: mockAccountConfirmationCode() }
    })
  })

  test('Should return false if UpdateAccountRepository returns false', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    jest.spyOn(updateAccountRepositoryStub, 'updateAccount').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.recover(mockPasswordRecoverParams())
    expect(result).toBe(false)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    jest.spyOn(updateAccountRepositoryStub, 'updateAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const params = mockPasswordRecoverParams()
    const promise = sut.recover(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendEmailRepository with correct params', async () => {
    const { sut, sendEmailStub } = makeSut()
    const sendSpy = jest.spyOn(sendEmailStub, 'send')
    await sut.recover(mockPasswordRecoverParams())
    expect(sendSpy).toHaveBeenCalledWith(makePasswordRecoverMail(
      env.recEmail,
      mockPasswordRecoverParams().email,
      mockAccountConfirmationCode().number)
    )
  })

  test('Should return false if SendEmailRepository returns false', async () => {
    const { sut, sendEmailStub } = makeSut()
    jest.spyOn(sendEmailStub, 'send').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.recover(mockPasswordRecoverParams())
    expect(result).toBe(false)
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const result = await sut.recover(mockPasswordRecoverParams())
    expect(result).toEqual(true)
  })
})
