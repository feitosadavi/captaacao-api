import { LoadAccountByIdRepository, UpdatePasswordRepository, Hasher } from '@/data/protocols'
import { DbUpdatePassword } from '@/data/usecases'

import { mockUpdatePasswordRepository, mockLoadAccountByIdRepository, mockHasher } from '@tests/data/mocks'
import { UpdatePassword } from '@/domain/usecases'
import { mockAccountModel } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbUpdatePassword
  hasherStub: Hasher
  updatePasswordRepositoryStub: UpdatePasswordRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const mockUpdateParams = (): UpdatePassword.Params => ({
  id: 'any_id',
  password: 'any_password'
})

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const updatePasswordRepositoryStub = mockUpdatePasswordRepository()
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository()
  const sut = new DbUpdatePassword(hasherStub, updatePasswordRepositoryStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    hasherStub,
    updatePasswordRepositoryStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbUpdatePassword Usecase', () => {
  test('Should call Hasher with correct params', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.update(mockUpdateParams())
    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should call LoadAccountByIdRepository with correct id', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.update(mockUpdateParams())
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return false if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockResolvedValueOnce(Promise.resolve(null))
    const account = await sut.update(mockUpdateParams())
    expect(account).toBe(false)
  })

  test('Should return true if LoadAccountByIdRepository returns an account', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockResolvedValueOnce(Promise.resolve(mockAccountModel()))
    const reuslt = await sut.update(mockUpdateParams())
    expect(reuslt).toBe(true)
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
