import { Authentication } from '@/domain/usecases'
import { DbAuthentication } from '@/data/usecases'
import {
  HashComparer, Encrypter,
  UpdateAccessTokenRepository, LoadAccountByEmailRepository
} from '@/data/protocols'
import MockDate from 'mockdate'

import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@tests/data/mocks'
import { mockAccountModel } from '@tests/domain/mocks'

const mockCredentials = (): Authentication.Params => {
  return {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

type SutTypes = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterGeneratorStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterGeneratorStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(mockCredentials())
    expect(loadSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com' })
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const account = sut.auth(mockCredentials())
    await expect(account).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
    const accessToken = await sut.auth(mockCredentials())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(mockCredentials())
    expect(compareSpy).toBeCalledWith('any_password', 'hashed_password')
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockCredentials())
    expect(accessToken).toBe(null)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterGeneratorStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterGeneratorStub, 'encrypt')
    await sut.auth(mockCredentials())
    expect(encryptSpy).toBeCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterGeneratorStub } = makeSut()
    jest.spyOn(encrypterGeneratorStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockCredentials())
    await expect(promise).rejects.toThrow()
  })

  test('Should return accessToken if Encrypter succeed', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockCredentials())
    expect(accessToken).toEqual(mockAccountModel())
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(mockCredentials())
    expect(updateSpy).toBeCalledWith({ id: 'any_id', accessToken: 'any_access_token' })
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(mockCredentials())
    await expect(promise).rejects.toThrow()
  })
})
