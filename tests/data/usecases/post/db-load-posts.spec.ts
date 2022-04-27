import MockDate from 'mockdate'

import { DbLoadAllPosts } from '@/data/usecases'
import { LoadAllPostsRepository } from '@/data/protocols'

import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockLoadAllPostsRepository } from '@tests/data/mocks/db/mock-db-post'

type SutTypes = {
  sut: DbLoadAllPosts
  loadPostsRepositoryStub: LoadAllPostsRepository
}

const makeSut = (): SutTypes => {
  const loadPostsRepositoryStub = mockLoadAllPostsRepository()
  const sut = new DbLoadAllPosts(loadPostsRepositoryStub)
  return {
    sut,
    loadPostsRepositoryStub
  }
}

describe('DbLoadAllPosts UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAllPostsRepository', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadPostsRepositoryStub, 'loadAll')
    await sut.load({})
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should call LoadAllPostsRepository with correct filters, if it exists', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadPostsRepositoryStub, 'loadAll')
    await sut.load({ postedBy: 'any_account_id' })
    expect(loadAllSpy).toHaveBeenCalledWith({ postedBy: 'any_account_id' })
  })

  test('Should return posts on LoadAllPostsRepository success', async () => {
    const { sut } = makeSut()
    const posts = await sut.load({})
    expect(posts).toEqual(mockPostsModel())
  })

  test('Should throw if LoadAllPostsRepository throws', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()
    jest.spyOn(loadPostsRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load({})
    await expect(promise).rejects.toThrow()
  })
})
