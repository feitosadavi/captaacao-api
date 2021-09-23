import { DeleteAccountRepository } from './db-delete-account-protocols'
import { mockDeleteAccountRepository, throwError } from '@/domain/test'
import { DbDeleteAccount } from './db-delete-account'

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
    await sut.delete('any_id')
    expect(deleteAccountRepositoryStubSpy).toBeCalledWith('any_id')
  })
  test('Should throw if deleteAccountRepository throws', async () => {
    const { sut, deleteAccountRepositoryStub } = makeSut()
    const deleteAccountRepositoryStubSpy = jest.spyOn(deleteAccountRepositoryStub, 'deleteAccount')
    deleteAccountRepositoryStubSpy.mockImplementation(throwError)
    const deletionResult = sut.delete('any_id')
    await expect(deletionResult).rejects.toThrow()
  })
  test('Should return true if deleteAccountRepository returns true', async () => {
    const { sut } = makeSut()
    const deletionResult = await sut.delete('any_id')
    expect(deletionResult).toBe(true)
  })
})
