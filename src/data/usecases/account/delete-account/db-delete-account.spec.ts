import { DeleteAccountRepository } from './db-delete-account-protocols'
import { mockDeleteAccountRepository } from '@/domain/test'
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
})
