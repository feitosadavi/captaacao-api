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

  test('Should LoadAllPostsRepository load filters if param is set', async () => {
    const { sut } = makeSut()
    const res = await sut.load({ postedBy: 'any_account_id', loadFilterOptions: true })
    const posts = mockPostsModel()
    expect(res).toEqual({
      posts,
      filterOptions: {
        brand: ['any_brand', 'other_brand'],
        model: ['any_model', 'other_model'],
        fuel: ['any_fuel', 'other_fuel'],
        color: ['any_color', 'other_color'],
        doors: [4, 2],
        steering: ['any_steering', 'other_steering'],
        year: ['any_year', 'other_year']
      }
    })
  })

  test('Should return posts on LoadAllPostsRepository success', async () => {
    const { sut } = makeSut()
    const posts = await sut.load({})
    expect(posts).toEqual({ posts: mockPostsModel() })
  })

  test('Should throw if LoadAllPostsRepository throws', async () => {
    const { sut, loadPostsRepositoryStub } = makeSut()
    jest.spyOn(loadPostsRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load({})
    await expect(promise).rejects.toThrow()
  })
})
