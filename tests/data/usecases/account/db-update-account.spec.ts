import { LoadAccountByIdRepository, UpdateAccountRepository, Hasher } from '@/data/protocols'
import { DbUpdateAccount } from '@/data/usecases'

import { mockUpdateAccountRepository, mockLoadAccountByIdRepository, mockHasher } from '@tests/data/mocks'
import { UpdateAccount } from '@/domain/usecases'
import { mockAccountModel } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbUpdateAccount
  hasherStub: Hasher
  updateAccountRepositoryStub: UpdateAccountRepository
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const mockUpdateParams = (): UpdateAccount.Params => ({
  id: 'any_id',
  fields: { any_field: 'any_value' }
})

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const updateAccountRepositoryStub = mockUpdateAccountRepository()
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository()
  const sut = new DbUpdateAccount(updateAccountRepositoryStub, loadAccountByIdRepositoryStub)
  return {
    sut,
    hasherStub,
    updateAccountRepositoryStub,
    loadAccountByIdRepositoryStub
  }
}

describe('DbUpdateAccount Usecase', () => {
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

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountRepositoryStub, 'updateAccount')
    const params = mockUpdateParams()
    await sut.update(params)
    expect(updateSpy).toHaveBeenCalledWith(params)
  })

  test('Should DbUpdateAccount throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositoryStub } = makeSut()
    jest.spyOn(updateAccountRepositoryStub, 'updateAccount').mockReturnValueOnce(Promise.reject(new Error()))
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
