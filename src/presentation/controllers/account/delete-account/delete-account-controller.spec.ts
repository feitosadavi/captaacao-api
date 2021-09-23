import { mockDeleteAccount, mockLoadAccountByToken } from '@/domain/test'
import { DeleteAccount } from '@/domain/usecases/account/delete-account'
import { serverError, serverSuccess, unauthorized } from '@/presentation/helpers/http/http-helper'
import { LoadAccountByToken } from '@/presentation/middlewares/auth-middleware-protocols'
import { DeleteAccountController } from './delete-account-controller'

type SutTypes = {
  sut: DeleteAccountController
  deleteAccountStub: DeleteAccount
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const deleteAccountStub = mockDeleteAccount()
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new DeleteAccountController(deleteAccountStub, loadAccountByTokenStub)
  return {
    sut,
    deleteAccountStub,
    loadAccountByTokenStub
  }
}

// id: 'any_id',
// name: 'any_name',
// email: 'any_email@mail.com',
// password: 'hashed_password',
// cpf: 'any_cpf',
// birthDate: '00/00/0000',
// phoneNumber: '9999999999999',
// role: 'any_role'

describe('DeleteAccount Controller', () => {
  test('Should call loadAccountByToken with correct params', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadAccountByTokenStubSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({
      params: { id: 'other_id' },
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(loadAccountByTokenStubSpy).toHaveBeenCalledWith('any_access_token')
  })

  test('Should return 401 if user is not admin or is not deleting your own account', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      params: { id: 'other_id' },
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if loadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadAccountByTokenStubSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    loadAccountByTokenStubSpy.mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle({
      params: { id: 'other_id' },
      headers: {
        'x-access-token': 'any_access_token'
      }
    })
    expect(response).toEqual(serverError(new Error()))
  })

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