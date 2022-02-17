import MockDate from 'mockdate'

import { ProfileNameIsInUseRepository, AddProfileRepository } from '@/data/protocols'
import { DbAddProfile } from '@/data/usecases'

import { mockProfileParams } from '@tests/domain/mocks'
import { mockAddProfileRepositoryStub, mockProfileNameIsInUseRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbAddProfile
  ProfileNameIsInUseRepositoryStub: ProfileNameIsInUseRepository
  addProfileRepositoryStub: AddProfileRepository
}

const makeSut = (): SutTypes => {
  const addProfileRepositoryStub = mockAddProfileRepositoryStub()
  const ProfileNameIsInUseRepositoryStub = mockProfileNameIsInUseRepository()
  const sut = new DbAddProfile(ProfileNameIsInUseRepositoryStub, addProfileRepositoryStub)
  return {
    sut,
    ProfileNameIsInUseRepositoryStub,
    addProfileRepositoryStub
  }
}

describe('DbAddProfile Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })
  test('Should call ProfileNameIsInUseRepository with correct email', async () => {
    const { sut, ProfileNameIsInUseRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(ProfileNameIsInUseRepositoryStub, 'nameIsInUse')
    await sut.add(mockProfileParams())
    expect(loadSpy).toHaveBeenCalledWith({ name: 'any_name' })
  })

  test('Should return false if ProfileNameIsInUseRepository returns true', async () => {
    const { sut, ProfileNameIsInUseRepositoryStub } = makeSut()
    jest.spyOn(ProfileNameIsInUseRepositoryStub, 'nameIsInUse').mockResolvedValueOnce(Promise.resolve(true))
    const profile = await sut.add(mockProfileParams())
    expect(profile).toBe(false)
  })

  test('Should call AddProfileRepository with correct values', async () => {
    const { sut, addProfileRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addProfileRepositoryStub, 'add')
    await sut.add(mockProfileParams())
    expect(addSpy).toHaveBeenCalledWith(mockProfileParams())
  })

  test('Should DbAddProfile throw if AddProfileRepository throws', async () => {
    const { sut, addProfileRepositoryStub } = makeSut()
    jest.spyOn(addProfileRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockProfileParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const profile = await sut.add(mockProfileParams())
    expect(profile).toEqual(true)
  })
})
