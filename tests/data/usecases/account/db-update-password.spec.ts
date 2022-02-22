import { UpdatePassword } from '@/domain/usecases'
import { UpdatePasswordRepository, Hasher } from '@/data/protocols'
import { DbUpdatePassword } from '@/data/usecases'

import { mockUpdatePasswordRepository, mockHasher } from '@tests/data/mocks'

type SutTypes = {
  sut: DbUpdatePassword
  hasherStub: Hasher
  updatePasswordRepositoryStub: UpdatePasswordRepository
}

const mockUpdateParams = (): UpdatePassword.Params => ({
  id: 'any_id',
  password: 'any_password'
})

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const updatePasswordRepositoryStub = mockUpdatePasswordRepository()
  const sut = new DbUpdatePassword(hasherStub, updatePasswordRepositoryStub)
  return {
    sut,
    hasherStub,
    updatePasswordRepositoryStub
  }
}

describe('DbUpdatePassword Usecase', () => {
  test('Should call Hasher with correct params', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.update(mockUpdateParams())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should call UpdatePasswordRepository with correct values', async () => {
    const { sut, updatePasswordRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updatePasswordRepositoryStub, 'updatePassword')
    const params: UpdatePasswordRepository.Params = {
      id: 'any_id',
      password: 'hashed_password'
    }
    await sut.update(params)
    expect(updateSpy).toHaveBeenCalledWith(params)
  })

  test('Should DbUpdatePassword throw if UpdatePasswordRepository throws', async () => {
    const { sut, updatePasswordRepositoryStub } = makeSut()
    jest.spyOn(updatePasswordRepositoryStub, 'updatePassword').mockReturnValueOnce(Promise.reject(new Error()))
    const params = mockUpdateParams()
    const promise = sut.update(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const result = await sut.update(mockUpdateParams())
    expect(result).toEqual(true)
  })
})
