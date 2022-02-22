import { DeleteAccount } from '@/domain/usecases/account/delete-account'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { DeleteAccountController } from '@/presentation/controllers'

import { mockDeleteAccount } from '@tests/presentation/mocks'

type SutTypes = {
  sut: DeleteAccountController
  deleteAccountStub: DeleteAccount
}

const makeSut = (): SutTypes => {
  const deleteAccountStub = mockDeleteAccount()
  const sut = new DeleteAccountController(deleteAccountStub)
  return {
    sut,
    deleteAccountStub
  }
}

const mockRequest = (): DeleteAccountController.Request => ({
  id: 'any_id'
})

describe('DeleteAccount Controller', () => {
  test('Should call deleteAccount with correct params', async () => {
    const { sut, deleteAccountStub } = makeSut()
    const deleteAccountStubSpy = jest.spyOn(deleteAccountStub, 'delete')
    await sut.handle(mockRequest())
    expect(deleteAccountStubSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return 500 if deleteAccount throws', async () => {
    const { sut, deleteAccountStub } = makeSut()
    const deleteAccountStubSpy = jest.spyOn(deleteAccountStub, 'delete')
    deleteAccountStubSpy.mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverSuccess(true))
  })
})
