import MockDate from 'mockdate'

import { DbLoadProfiles } from '@/data/usecases'
import { LoadProfilesRepository } from '@/data/protocols'

import { mockLoadProfilesRepository } from '@tests/data/mocks'
import { mockProfileModels, throwError } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbLoadProfiles
  loadProfilesRepositoryStub: LoadProfilesRepository
}

const makeSut = (): SutTypes => {
  const loadProfilesRepositoryStub = mockLoadProfilesRepository()
  const sut = new DbLoadProfiles(loadProfilesRepositoryStub)
  return {
    sut,
    loadProfilesRepositoryStub
  }
}

describe('DbLoadProfiles', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadProfilesRepository', async () => {
    const { sut, loadProfilesRepositoryStub } = makeSut()
    const loadProfilesRepositoryStubSpy = jest.spyOn(loadProfilesRepositoryStub, 'loadProfiles')
    await sut.load()
    expect(loadProfilesRepositoryStubSpy).toHaveBeenCalled()
  })

  test('Should throw if LoadProfilesRepository throws', async () => {
    const { sut, loadProfilesRepositoryStub } = makeSut()
    const loadProfilesRepositoryStubSpy = jest.spyOn(loadProfilesRepositoryStub, 'loadProfiles')
    loadProfilesRepositoryStubSpy.mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })

  test('Should return account array if LoadProfilesRepository return account array', async () => {
    const { sut } = makeSut()
    const accounts = await sut.load()
    expect(accounts).toEqual(mockProfileModels())
  })

  test('Should return null if LoadProfilesRepository return null', async () => {
    const { sut, loadProfilesRepositoryStub } = makeSut()
    const loadProfilesRepositoryStubSpy = jest.spyOn(loadProfilesRepositoryStub, 'loadProfiles')
    loadProfilesRepositoryStubSpy.mockReturnValueOnce(Promise.resolve(null))
    const accounts = await sut.load()
    expect(accounts).toBeNull()
  })
})
