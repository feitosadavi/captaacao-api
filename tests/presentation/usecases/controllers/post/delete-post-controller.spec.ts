import { DeletePost, LoadPostById } from '@/domain/usecases'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { DeletePostController } from '@/presentation/controllers'
import { unauthorized } from '@/presentation/helpers'

import { mockDeletePost, mockLoadPostById } from '@tests/presentation/mocks'
import { mockPostsModel } from '@tests/domain/mocks'

type SutTypes = {
  sut: DeletePostController
  loadPostByIdStub: LoadPostById
  deletePostStub: DeletePost
}

const makeSut = (): SutTypes => {
  const deletePostStub = mockDeletePost()
  const loadPostByIdStub = mockLoadPostById()
  const sut = new DeletePostController(deletePostStub, loadPostByIdStub)
  return {
    sut,
    loadPostByIdStub,
    deletePostStub
  }
}

const mockRequest = (): DeletePostController.Request => ({ id: 'any_id', accountId: 'any_account_id' })

describe('DeletePostController', () => {
  test('Should call loadPostById with correct params', async () => {
    const { sut, loadPostByIdStub } = makeSut()
    const loadPostByIdStubSpy = jest.spyOn(loadPostByIdStub, 'load')
    await sut.handle(mockRequest())
    expect(loadPostByIdStubSpy).toHaveBeenCalledWith({ id: 'any_id' })
  })

  test('Should return 401 if post id is different from the account id', async () => {
    const { sut, loadPostByIdStub } = makeSut()
    const loadPostByIdStubSpy = jest.spyOn(loadPostByIdStub, 'load')
    loadPostByIdStubSpy.mockReturnValueOnce(Promise.resolve({ ...mockPostsModel()[0], postedBy: 'any_account_id' }))
    const response = await sut.handle({ id: 'any_id', accountId: 'different_account_id' })
    expect(response).toEqual(unauthorized())
  })

  test('Should call deletePost with correct params', async () => {
    const { sut, deletePostStub } = makeSut()
    const deletePostStubSpy = jest.spyOn(deletePostStub, 'delete')
    await sut.handle(mockRequest())
    expect(deletePostStubSpy).toHaveBeenCalledWith({ id: 'any_id' })
  })

  test('Should return 500 if deletePost throws', async () => {
    const { sut, deletePostStub } = makeSut()
    const deletePostStubSpy = jest.spyOn(deletePostStub, 'delete')
    deletePostStubSpy.mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverSuccess(true))
  })
})
