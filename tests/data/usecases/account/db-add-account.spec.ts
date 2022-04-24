import { LoadAccountByEmailRepository, AddAccountRepository, Hasher, UploadFile } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases'

import { mockAccountModel, mockAccountParams } from '@tests/domain/mocks'
import { mockAccountRepositoryParams, mockAddAccountRepositoryStub, mockHasher, mockUploadFileStub } from '@tests/data/mocks'

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepository implements LoadAccountByEmailRepository {
    async loadByEmail (params: LoadAccountByEmailRepository.Params): LoadAccountByEmailRepository.Result {
      return Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepository()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  uploadFileStub: UploadFile
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepositoryStub()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const uploadFileStub = mockUploadFileStub()
  const sut = new DbAddAccount(hasherStub, uploadFileStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    uploadFileStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAccountParams())
    expect(loadByEmailSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com' })
  })

  test('Should return false if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(Promise.resolve(mockAccountModel()))
    const account = await sut.add(mockAccountParams())
    expect(account).toBe(false)
  })

  test('Should not call UploadFile if profilePhoto isnt set', async () => {
    const { sut, uploadFileStub } = makeSut()
    const uploadSpy = jest.spyOn(uploadFileStub, 'upload')
    const { profilePhoto, ...params } = mockAccountParams() // remove profilePhoto
    await sut.add(params)
    expect(uploadSpy).toHaveBeenCalledTimes(0)
  })

  test('Should call UploadFile with correct input', async () => {
    const { sut, uploadFileStub } = makeSut()
    const uploadSpy = jest.spyOn(uploadFileStub, 'upload')
    const accountParams = mockAccountParams()
    await sut.add(accountParams)
    expect(uploadSpy).toHaveBeenCalledWith({
      file: accountParams.profilePhoto.buffer,
      fileName: accountParams.profilePhoto.fileName
    })
  })

  test('Should call Hasher with correct plaintext', async () => {
    const { sut, hasherStub } = makeSut()
    const addAccountParams = mockAccountParams()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(addAccountParams)
    expect(hasherSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const accountData = mockAccountParams()
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository without profilePhoto if it isnt set', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addAccount')

    const { profilePhoto: db, ...dbParams } = mockAccountParams() // remove profilePhoto
    await sut.add(dbParams)

    const { profilePhoto: repo, ...repoParams } = mockAccountRepositoryParams() // remove profilePhoto
    expect(addSpy).toHaveBeenCalledWith({ ...repoParams, password: 'hashed_password' })
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'addAccount')
    const params = { ...mockAccountParams(), password: 'hashed_password' }
    await sut.add(params)
    expect(addSpy).toHaveBeenCalledWith({ ...mockAccountRepositoryParams(), password: 'hashed_password' })
  })

  test('Should DbAddAccount throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'addAccount').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAccountParams())
    expect(account).toEqual(true)
  })
})
