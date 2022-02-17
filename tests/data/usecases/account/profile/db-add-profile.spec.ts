import { CheckProfileByNameRepository, AddProfileRepository } from '@/data/protocols'
import { DbAddProfile } from '@/data/usecases'

import { mockProfileParams } from '@tests/domain/mocks'
import { mockAddProfileRepositoryStub, mockCheckProfileByNameRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbAddProfile
  checkProfileByNameRepositoryStub: CheckProfileByNameRepository
  addProfileRepositoryStub: AddProfileRepository
}

const makeSut = (): SutTypes => {
  const addProfileRepositoryStub = mockAddProfileRepositoryStub()
  const checkProfileByNameRepositoryStub = mockCheckProfileByNameRepository()
  const sut = new DbAddProfile(checkProfileByNameRepositoryStub, addProfileRepositoryStub)
  return {
    sut,
    checkProfileByNameRepositoryStub,
    addProfileRepositoryStub
  }
}

describe('DbAddProfile Usecase', () => {
  test('Should call CheckProfileByNameRepository with correct email', async () => {
    const { sut, checkProfileByNameRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(checkProfileByNameRepositoryStub, 'checkByName')
    await sut.add(mockProfileParams())
    expect(loadSpy).toHaveBeenCalledWith({ name: 'any_name' })
  })

  test('Should return false if CheckProfileByNameRepository returns true', async () => {
    const { sut, checkProfileByNameRepositoryStub } = makeSut()
    jest.spyOn(checkProfileByNameRepositoryStub, 'checkByName').mockResolvedValueOnce(Promise.resolve(true))
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
