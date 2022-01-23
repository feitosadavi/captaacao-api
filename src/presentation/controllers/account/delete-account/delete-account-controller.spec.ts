import { DeleteAccount } from '@/domain/usecases/account/delete-account'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { mockDeleteAccount } from '@tests/presentation/mocks'
import { DeleteAccountController } from './delete-account-controller'

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

describe('DeleteAccount Controller', () => {
  test('Should call deleteAccount with correct params', async () => {
    const { sut, deleteAccountStub } = makeSut()
    const deleteAccountStubSpy = jest.spyOn(deleteAccountStub, 'delete')
    await sut.handle({
      params: { id: 'any_id' }, // id igual, por isso irá passar ;)
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(deleteAccountStubSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 500 if deleteAccount throws', async () => {
    const { sut, deleteAccountStub } = makeSut()
    const deleteAccountStubSpy = jest.spyOn(deleteAccountStub, 'delete')
    deleteAccountStubSpy.mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle({
      params: { id: 'any_id' },
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      params: { id: 'any_id' }, // id igual, por isso irá passar ;)
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(response).toEqual(serverSuccess(true))
  })
})
