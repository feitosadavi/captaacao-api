import MockDate from 'mockdate'

import { DbLoadPosts } from '@/data/usecases'
import { LoadPostsRepository } from '@/data/protocols'

import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockLoadPostsRepository } from '@tests/data/mocks/db/mock-db-post'

type SutTypes = {
  sut: DbLoadPosts
  loadPostsRepositoryStub: LoadPostsRepository
}

const makeSut = (): SutTypes => {
  const loadPostsRepositoryStub = mockLoadPostsRepository()
  const sut = new DbLoadPosts(loadPostsRepositoryStub)
  return {
    sut,
    loadPostsRepositoryStub
  }
}

describe('DbLoadPosts UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadPostsRepository', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadPostsRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return posts on LoadPostsRepository success', async () => {
    const { sut } = makeSut()
    const posts = await sut.load()
    expect(posts).toEqual(mockPostsModel())
  })

  test('Should throw if LoadPostsRepository throws', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()
    jest.spyOn(loadPostsRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
