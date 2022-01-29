import MockDate from 'mockdate'

import { DbLoadIdByEmail } from '@/data/usecases'
import { LoadAccountByEmailRepository } from '@/data/protocols'

import { mockAccountModel, throwError } from '@tests/domain/mocks'
import { mockLoadAccountByEmailRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbLoadIdByEmail
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new DbLoadIdByEmail(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbLoadIdByEmail', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadIdByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.load({ id: 'any_id' })
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return an id on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load({ id: 'any_id' })
    expect(account).toEqual(mockAccountModel().id)
  })

  test('Should return falsy if LoadIdByEmail returns falsy', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const account = await sut.load({ id: 'any_id' })
    expect(account).toBeFalsy()
  })

  test('Should throw if LoadIdByEmail throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.load({ id: 'any_id' })
    await expect(promise).rejects.toThrow()
  })
})
