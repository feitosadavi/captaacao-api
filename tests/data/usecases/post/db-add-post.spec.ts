import MockDate from 'mockdate'

import { DbAddPost } from '@/data/usecases'

import { mockPostsParams, throwError } from '@tests/domain/mocks'
import { mockAddPostRepository } from '@tests/data/mocks/db/mock-db-post'

const makeSut = (): any => {
  const addPostRepositoryStub = mockAddPostRepository()
  const sut = new DbAddPost(addPostRepositoryStub)
  return {
    sut,
    addPostRepositoryStub
  }
}

describe('DbAddPost UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call AddPostRepository with correct values', async () => {
    const { sut, addPostRepositoryStub } = makeSut()
    const postData = mockPostsParams()
    const addSpy = jest.spyOn(addPostRepositoryStub, 'add')
    await sut.add(postData)
    expect(addSpy).toHaveBeenCalledWith(postData)
  })

  test('Should throw if AddPostRepository throws', async () => {
    const { sut, addPostRepositoryStub } = makeSut()
    const postData = mockPostsParams()
    jest.spyOn(addPostRepositoryStub, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(postData)
    await expect(promise).rejects.toThrow()
  })
})
