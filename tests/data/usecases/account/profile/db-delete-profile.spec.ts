import { DeleteProfileRepository } from '@/data/protocols'
import { DbDeleteProfile } from '@/data/usecases'

import { throwError } from '@tests/domain/mocks'
import { mockDeleteProfileRepository } from '@tests/data/mocks'
import { DeleteProfile } from '@/domain/usecases'

type SutTypes = {
  sut: DbDeleteProfile
  deleteProfileRepositoryStub: DeleteProfileRepository
}

const mockParams = (): DeleteProfile.Params => ({
  id: 'any_id'
})

const makeSut = (): SutTypes => {
  const deleteProfileRepositoryStub = mockDeleteProfileRepository()
  const sut = new DbDeleteProfile(deleteProfileRepositoryStub)

  return {
    sut,
    deleteProfileRepositoryStub
  }
}

describe('DbDeleteProfile', () => {
  test('Should call deleteProfileRepository with correct values', async () => {
    const { sut, deleteProfileRepositoryStub } = makeSut()
    const deleteProfileRepositoryStubSpy = jest.spyOn(deleteProfileRepositoryStub, 'deleteProfile')
    await sut.delete(mockParams())
    expect(deleteProfileRepositoryStubSpy).toBeCalledWith(mockParams())
  })
  test('Should throw if deleteProfileRepository throws', async () => {
    const { sut, deleteProfileRepositoryStub } = makeSut()
    const deleteProfileRepositoryStubSpy = jest.spyOn(deleteProfileRepositoryStub, 'deleteProfile')
    deleteProfileRepositoryStubSpy.mockImplementation(throwError)
    const deletionResult = sut.delete(mockParams())
    await expect(deletionResult).rejects.toThrow()
  })
  test('Should return false if deleteProfileRepository returns false', async () => {
    const { sut, deleteProfileRepositoryStub } = makeSut()
    const deleteProfileRepositoryStubSpy = jest.spyOn(deleteProfileRepositoryStub, 'deleteProfile')
    deleteProfileRepositoryStubSpy.mockReturnValueOnce(Promise.resolve(false))
    const deletionResult = await sut.delete(mockParams())
    expect(deletionResult).toBe(false)
  })
  test('Should return true if deleteProfileRepository returns true', async () => {
    const { sut } = makeSut()
    const deletionResult = await sut.delete(mockParams())
    expect(deletionResult).toBe(true)
  })
})
