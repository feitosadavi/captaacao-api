import MockDate from 'mockdate'

import { LoadAccountByCodeRepository } from '@/data/protocols'
import { DbLoadAccountByCode } from '@/data/usecases'

import { mockLoadAccountByCodeRepository } from '@tests/data/mocks'
import { mockAccountModel, throwError } from '@tests/domain/mocks'
import { LoadAccountByCode } from '@/domain/usecases'

type SutTypes = {
  sut: DbLoadAccountByCode
  loadAccountByCodeRepositoryStub: LoadAccountByCodeRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByCodeRepositoryStub = mockLoadAccountByCodeRepository()
  const sut = new DbLoadAccountByCode(loadAccountByCodeRepositoryStub)
  return {
    sut,
    loadAccountByCodeRepositoryStub
  }
}

const mockParams = (): LoadAccountByCode.Params => ({
  code: 999999
})

describe('DbLoadAccountByCode', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurvetByCodeRepository with correct values', async () => {
    const { sut, loadAccountByCodeRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByCodeRepositoryStub, 'loadByCode')
    await sut.load(mockParams())
    expect(loadSpy).toHaveBeenCalledWith(mockParams())
  })

  test('Should return an account on LoadSurvetByCodeRepository success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(mockParams())
    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadSurvetByCodeRepository returns null', async () => {
    const { sut, loadAccountByCodeRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByCodeRepositoryStub, 'loadByCode').mockReturnValueOnce(null)
    const account = await sut.load(mockParams())
    expect(account).toBeNull()
  })

  test('Should throw if LoadSurvetByCodeRepository throws', async () => {
    const { sut, loadAccountByCodeRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByCodeRepositoryStub, 'loadByCode').mockImplementationOnce(throwError)
    const promise = sut.load(mockParams())
    await expect(promise).rejects.toThrow()
  })
})
