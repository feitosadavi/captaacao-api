import { DeleteAccountRepository } from '@/data/protocols'
import { DbDeleteAccount } from '@/data/usecases'

import { throwError } from '@tests/domain/mocks'
import { mockDeleteAccountRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbDeleteAccount
  deleteAccountRepositoryStub: DeleteAccountRepository
}

const makeSut = (): SutTypes => {
  const deleteAccountRepositoryStub = mockDeleteAccountRepository()
  const sut = new DbDeleteAccount(deleteAccountRepositoryStub)

  return {
    sut,
    deleteAccountRepositoryStub
  }
}

describe('DbDeleteAccount', () => {
  test('Should call deleteAccountRepository with correct values', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSut()
    const deleteAccountRepositoryStubSpy = jest.spyOn(deleteAccountRepositoryStub, 'deleteAccount')
    await sut.delete({ id: 'any_id' })
    expect(deleteAccountRepositoryStubSpy).toBeCalledWith({ id: 'any_id' })
  })
  test('Should throw if deleteAccountRepository throws', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSut()
    const deleteAccountRepositoryStubSpy = jest.spyOn(deleteAccountRepositoryStub, 'deleteAccount')
    deleteAccountRepositoryStubSpy.mockImplementation(throwError)
    const deletionResult = sut.delete({ id: 'any_id' })
    await expect(deletionResult).rejects.toThrow()
  })
  test('Should return false if deleteAccountRepository returns false', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSut()
    const deleteAccountRepositoryStubSpy = jest.spyOn(deleteAccountRepositoryStub, 'deleteAccount')
    deleteAccountRepositoryStubSpy.mockReturnValueOnce(Promise.resolve(false))
    const deletionResult = await sut.delete({ id: 'any_id' })
    expect(deletionResult).toBe(false)
  })
  test('Should return true if deleteAccountRepository returns true', async () => {
    const { sut } = makeSut()
    const deletionResult = await sut.delete({ id: 'any_id' })
    expect(deletionResult).toBe(true)
  })
})
