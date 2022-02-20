import MockDate from 'mockdate'

import { LoadPosts } from '@/domain/usecases'
import { LoadPostsController } from '@/presentation/controllers'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'

import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockLoadPosts } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadPostsController
  loadPostsStub: LoadPosts
}

const makeSut = (): SutTypes => {
  const loadPostsStub = mockLoadPosts()
  const sut = new LoadPostsController(loadPostsStub)
  return {
    sut,
    loadPostsStub
  }
}

describe('LoadPost Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadPosts', async () => {
    const { sut, loadPostsStub } = makeSut()
    const loadPostsSpy = jest.spyOn(loadPostsStub, 'load')
    await sut.handle({})
    expect(loadPostsSpy).toHaveBeenCalled()
  })

  test('Should 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverSuccess(mockPostsModel()))
  })

  test('Should 204 LoadPosts returns empty', async () => {
    const { sut, loadPostsStub } = makeSut()
    jest.spyOn(loadPostsStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadPosts throws', async () => {
    const { sut, loadPostsStub } = makeSut()
    jest.spyOn(loadPostsStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
