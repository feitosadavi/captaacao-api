import MockDate from 'mockdate'

import { LoadPostByIdRepository } from '@/data/protocols'
import { DbLoadPostById } from '@/data/usecases'

import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockLoadPostByIdRepository } from '@tests/data/mocks/db/mock-db-post'

type SutTypes = {
  sut: DbLoadPostById
  loadPostByIdRepositoryStub: LoadPostByIdRepository
}

const makeSut = (): SutTypes => {
  const loadPostByIdRepositoryStub = mockLoadPostByIdRepository()
  const sut = new DbLoadPostById(loadPostByIdRepositoryStub)
  return {
    sut,
    loadPostByIdRepositoryStub
  }
}

describe('DbLoadPostById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurvetByIdRepository with correct values', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()
    const loadById = jest.spyOn(loadPostByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should return an post on LoadSurvetByIdRepository success', async () => {
    const { sut } = makeSut()
    const post = await sut.loadById('any_id')
    expect(post).toEqual(mockPostsModel()[0])
  })

  test('Should return null if LoadSurvetByIdRepository returns null', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()
    jest.spyOn(loadPostByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)
    const post = await sut.loadById('any_id')
    expect(post).toBeNull()
  })

  test('Should throw if LoadSurvetByIdRepository throws', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()
    jest.spyOn(loadPostByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
