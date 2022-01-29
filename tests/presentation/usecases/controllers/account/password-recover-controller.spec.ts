import { GeneratePassRecoverInfo } from '@/data/protocols/others'
import { UpdateAccount, LoadIdByEmail } from '@/domain/usecases'
import { PasswordRecoverController } from '@/presentation/controllers/account/password-recover-controller'
import { NotFoundAccountError } from '@/presentation/errors/not-found-account'
import { badRequest, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'
import { mockRecoverPassInfo } from '@tests/domain/mocks'

import { mockGeneratePassRecoverInfoStub, mockLoadIdByEmail, mockUpdateAccount } from '@tests/presentation/mocks'

type SutTypes = {
  sut: PasswordRecoverController
  loadIdByEmailStub: LoadIdByEmail
  updateAccountStub: UpdateAccount
  generatePassRecoverInfoStub: GeneratePassRecoverInfo

}

const mockRequest = (): HttpRequest => (
  {
    params: {
      id: 'any_id'
    }
  }
)

const mockUpdateAccountParams = (): UpdateAccount.Params => ({
  id: mockRequest().params.id,
  fields: { recoverPassInfo: mockRecoverPassInfo() }
})

const makeSut = (): SutTypes => {
  const loadIdByEmailStub = mockLoadIdByEmail()
  const updateAccountStub = mockUpdateAccount()
  const generatePassRecoverInfoStub = mockGeneratePassRecoverInfoStub()
  const sut = new PasswordRecoverController(loadIdByEmailStub, updateAccountStub, generatePassRecoverInfoStub)
  return {
    sut,
    loadIdByEmailStub,
    updateAccountStub,
    generatePassRecoverInfoStub
  }
}

describe('PasswordRecover Controller', () => {
  test('Should call LoadIdByEmail with correct id', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    const loadAccountByIdSpy = jest.spyOn(loadIdByEmailStub, 'load')
    await sut.handle(mockRequest())
    expect(loadAccountByIdSpy).toHaveBeenCalledWith({ id: 'any_id' })
  })

  test('Should return 400 if LoadIdByEmail dont find any account', async () => {
    const { sut, loadIdByEmailStub } = makeSut()
    jest.spyOn(loadIdByEmailStub, 'load').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new NotFoundAccountError()))
  })

  test('Should call UpdateAccount with correct params', async () => {
    const { sut, updateAccountStub } = makeSut()
    const updateAccountSpy = jest.spyOn(updateAccountStub, 'update')
    await sut.handle(mockRequest())
    expect(updateAccountSpy).toHaveBeenCalledWith(mockUpdateAccountParams())
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })
})
