import MockDate from 'mockdate'

import { LoadAccountByIdRepository } from '@/data/protocols'
import { DbLoadAccountById } from '@/data/usecases'

import { mockLoadAccountByIdRepository } from '@tests/data/mocks'
import { mockAccountModel, throwError } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbLoadAccountById
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = mockLoadAccountByIdRepository()
  const sut = new DbLoadAccountById(loadAccountByIdRepositoryStub)
  return {
    sut,
    loadAccountByIdRepositoryStub
  }
}

describe('DbLoadAccountById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurvetByIdRepository with correct values', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    const loadById = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should return an account on LoadSurvetByIdRepository success', async () => {
    const { sut } = makeSut()
    const account = await sut.loadById('any_id')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadSurvetByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)
    const account = await sut.loadById('any_id')
    expect(account).toBeNull()
  })

  test('Should throw if LoadSurvetByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
