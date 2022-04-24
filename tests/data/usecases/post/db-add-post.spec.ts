import MockDate from 'mockdate'

import { DbAddPost } from '@/data/usecases'

import { mockPostsParams, throwError } from '@tests/domain/mocks'
import { mockAddPostRepository, mockPostsRepositoryParams } from '@tests/data/mocks/db/mock-db-post'
import { mockUploadManyFilesStub } from '@tests/data/mocks'
import { AddPostRepository, UploadManyFiles } from '@/data/protocols'

type SutType = {
  sut: DbAddPost
  addPostRepositoryStub: AddPostRepository
  uploadManyFileStub: UploadManyFiles
}

const makeSut = (): SutType => {
  const addPostRepositoryStub = mockAddPostRepository()
  const uploadManyFileStub = mockUploadManyFilesStub()
  const sut = new DbAddPost(addPostRepositoryStub, uploadManyFileStub)
  return {
    sut,
    addPostRepositoryStub,
    uploadManyFileStub
  }
}

describe('DbAddPost UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call UploadFile with correct input', async () => {
    const { sut, uploadManyFileStub } = makeSut()
    const uploadSpy = jest.spyOn(uploadManyFileStub, 'uploadMany')
    const params = mockPostsParams()[0] // remove phtos
    await sut.add(params)
    const photos = params.photos.map(p => ({ file: p.buffer, fileName: p.fileName }))
    expect(uploadSpy).toHaveBeenCalledWith(photos)
  })

  test('Should throw if UploadFile throws', async () => {
    const { sut, uploadManyFileStub } = makeSut()
    const postData = mockPostsParams()[0]
    jest.spyOn(uploadManyFileStub, 'uploadMany').mockImplementationOnce(throwError)
    const promise = sut.add(postData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddPostRepository with correct values', async () => {
    const { sut, addPostRepositoryStub } = makeSut()
    const postData = mockPostsParams()[0]
    const addSpy = jest.spyOn(addPostRepositoryStub, 'addPost')
    await sut.add(postData)
    expect(addSpy).toHaveBeenCalledWith(mockPostsRepositoryParams()[0])
  })

  test('Should throw if AddPostRepository throws', async () => {
    const { sut, addPostRepositoryStub } = makeSut()
    const postData = mockPostsParams()[0]
    jest.spyOn(addPostRepositoryStub, 'addPost').mockImplementationOnce(throwError)
    const promise = sut.add(postData)
    await expect(promise).rejects.toThrow()
  })
})
