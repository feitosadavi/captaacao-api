import MockDate from 'mockdate'

import { DbLoadIdByEmail } from '@/data/usecases'
import { LoadAccountByEmailRepository } from '@/data/protocols'

import { mockAccountModel, throwError } from '@tests/domain/mocks'
import { mockLoadAccountByEmailRepository } from '@tests/data/mocks'
import { LoadIdByEmail } from '@/domain/usecases'

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

const mockParams = (): LoadIdByEmail.Params => ({
  email: 'any_email@mail.com'
})

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
    await sut.load(mockParams())
    expect(loadSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com' })
  })

  test('Should return an id on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load(mockParams())
    expect(account).toEqual(mockAccountModel().id)
  })

  test('Should return falsy if LoadIdByEmail returns falsy', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const account = await sut.load(mockParams())
    expect(account).toBeFalsy()
  })

  test('Should throw if LoadIdByEmail throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.load(mockParams())
    await expect(promise).rejects.toThrow()
  })
})
