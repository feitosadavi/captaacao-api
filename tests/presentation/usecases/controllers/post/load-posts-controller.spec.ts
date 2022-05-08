import MockDate from 'mockdate'

import { LoadAllPosts } from '@/domain/usecases'
import { LoadAllPostsController } from '@/presentation/controllers'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'

import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockLoadAllPosts } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadAllPostsController
  loadPostsStub: LoadAllPosts
}

const makeSut = (): SutTypes => {
  const loadPostsStub = mockLoadAllPosts()
  const sut = new LoadAllPostsController(loadPostsStub)
  return {
    sut,
    loadPostsStub
  }
}

describe('LoadPostController', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadAllPosts', async () => {
    const { sut, loadPostsStub } = makeSut()
    const loadPostsSpy = jest.spyOn(loadPostsStub, 'load')
    await sut.handle({})
    expect(loadPostsSpy).toHaveBeenLastCalledWith({})
  })

  test('Should call LoadAllPosts with correct filters, if it exists', async () => {
    const { sut, loadPostsStub } = makeSut()
    const loadPostsSpy = jest.spyOn(loadPostsStub, 'load')
    await sut.handle({ postedBy: 'any_account_id' })
    expect(loadPostsSpy).toHaveBeenLastCalledWith({ postedBy: 'any_account_id' })
  })

  test('Should 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverSuccess({ posts: mockPostsModel() }))
  })

  test('Should 204 LoadAllPosts returns empty', async () => {
    const { sut, loadPostsStub } = makeSut()
    jest.spyOn(loadPostsStub, 'load').mockReturnValueOnce(Promise.resolve({ posts: [] }))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadAllPosts throws', async () => {
    const { sut, loadPostsStub } = makeSut()
    jest.spyOn(loadPostsStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
