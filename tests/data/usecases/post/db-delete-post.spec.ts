import { DeletePost } from '@/domain/usecases'
import { DeletePostRepository } from '@/data/protocols'
import { DbDeletePost } from '@/data/usecases'

import { throwError } from '@tests/domain/mocks'
import { mockDeletePostRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbDeletePost
  deletePostRepositoryStub: DeletePostRepository
}

const mockParams = (): DeletePost.Params => ({
  id: 'any_id'
})

const makeSut = (): SutTypes => {
  const deletePostRepositoryStub = mockDeletePostRepository()
  const sut = new DbDeletePost(deletePostRepositoryStub)

  return {
    sut,
    deletePostRepositoryStub
  }
}

describe('DbDeletePost', () => {
  test('Should call deletePostRepository with correct values', async () => {
    const { sut, deletePostRepositoryStub } = makeSut()
    const deletePostRepositoryStubSpy = jest.spyOn(deletePostRepositoryStub, 'deletePost')
    await sut.delete(mockParams())
    expect(deletePostRepositoryStubSpy).toBeCalledWith(mockParams())
  })
  test('Should throw if deletePostRepository throws', async () => {
    const { sut, deletePostRepositoryStub } = makeSut()
    const deletePostRepositoryStubSpy = jest.spyOn(deletePostRepositoryStub, 'deletePost')
    deletePostRepositoryStubSpy.mockImplementation(throwError)
    const deletionResult = sut.delete(mockParams())
    await expect(deletionResult).rejects.toThrow()
  })
  test('Should return false if deletePostRepository returns false', async () => {
    const { sut, deletePostRepositoryStub } = makeSut()
    const deletePostRepositoryStubSpy = jest.spyOn(deletePostRepositoryStub, 'deletePost')
    deletePostRepositoryStubSpy.mockReturnValueOnce(Promise.resolve(false))
    const deletionResult = await sut.delete(mockParams())
    expect(deletionResult).toBe(false)
  })
  test('Should return true if deletePostRepository returns true', async () => {
    const { sut } = makeSut()
    const deletionResult = await sut.delete(mockParams())
    expect(deletionResult).toBe(true)
  })
})
