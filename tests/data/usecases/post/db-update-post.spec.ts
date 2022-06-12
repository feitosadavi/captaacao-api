import { UpdatePost } from '@/domain/usecases'
import { LoadPostByIdRepository, UpdatePostRepository, DeleteManyFiles, UploadManyFiles, Hasher } from '@/data/protocols'
import { DbUpdatePost } from '@/data/usecases'

import { mockUpdatePostRepository, mockLoadPostByIdRepository, mockHasher, mockUploadManyFilesStub, mockDeleteManyFilesStub } from '@tests/data/mocks'
import { mockPostsModel } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbUpdatePost
  hasherStub: Hasher
  updatePostRepositoryStub: UpdatePostRepository
  loadPostByIdRepositoryStub: LoadPostByIdRepository
  deleteManyFilesStub: DeleteManyFiles
  uploadManyFilesStub: UploadManyFiles
}

const mockParams = (): UpdatePost.Params => ({
  id: 'any_id',
  fields: { any_field: 'any_value' }
})

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const updatePostRepositoryStub = mockUpdatePostRepository()
  const loadPostByIdRepositoryStub = mockLoadPostByIdRepository()
  const deleteManyFilesStub = mockDeleteManyFilesStub()
  const uploadManyFilesStub = mockUploadManyFilesStub()
  const sut = new DbUpdatePost(updatePostRepositoryStub, loadPostByIdRepositoryStub, deleteManyFilesStub, uploadManyFilesStub)
  return {
    sut,
    hasherStub,
    updatePostRepositoryStub,
    loadPostByIdRepositoryStub,
    deleteManyFilesStub,
    uploadManyFilesStub
  }
}

describe('DbUpdatePost Usecase', () => {
  test('Should call LoadPostByIdRepository with correct id', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadPostByIdRepositoryStub, 'loadById')
    await sut.update(mockParams())
    expect(loadSpy).toHaveBeenCalledWith({ id: 'any_id' })
  })

  test('Should return false if LoadPostByIdRepository returns null', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()
    jest.spyOn(loadPostByIdRepositoryStub, 'loadById').mockResolvedValueOnce(Promise.resolve(null))
    const account = await sut.update(mockParams())
    expect(account).toBe(false)
  })

  test('Should return true if LoadPostByIdRepository returns an account', async () => {
    const { sut, loadPostByIdRepositoryStub } = makeSut()
    jest.spyOn(loadPostByIdRepositoryStub, 'loadById').mockResolvedValueOnce(Promise.resolve(mockPostsModel()[0]))
    const reuslt = await sut.update(mockParams())
    expect(reuslt).toBe(true)
  })

  test('Should call DeleteManyFiles with old photos update fields has new photos', async () => {
    const { sut, deleteManyFilesStub } = makeSut()
    const deleteManySpy = jest.spyOn(deleteManyFilesStub, 'deleteMany')
    await sut.update({ ...mockParams(), fields: { photos: [{ buffer: Buffer.alloc(1), fileName: 'any_photo' }] } })
    expect(deleteManySpy).toHaveBeenCalledWith({ filesNames: mockPostsModel()[0].photos })
  })

  test('Should call UploadManyFiles if update fields has new photos', async () => {
    const { sut, uploadManyFilesStub } = makeSut()
    const uploadManySpy = jest.spyOn(uploadManyFilesStub, 'uploadMany')
    await sut.update({ ...mockParams(), fields: { photos: [{ buffer: Buffer.alloc(1), fileName: 'any_photo' }] } })
    expect(uploadManySpy).toHaveBeenCalledWith([{ file: Buffer.alloc(1), fileName: 'any_photo' }])
  })

  test('Should call UpdatePostRepository with correct values if has new photos', async () => {
    const { sut, updatePostRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updatePostRepositoryStub, 'updatePost')
    const params = { ...mockParams(), fields: { photos: [{ buffer: Buffer.alloc(1), fileName: 'any_photo' }] } }
    await sut.update(params)
    expect(updateSpy).toHaveBeenCalledWith({ ...params, fields: { photos: ['any_photo'] } })
  })

  test('Should call UpdatePostRepository with correct values if has no new photos', async () => {
    const { sut, updatePostRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updatePostRepositoryStub, 'updatePost')
    const params = mockParams()
    await sut.update(params)
    expect(updateSpy).toHaveBeenCalledWith(params)
  })

  test('Should DbUpdatePost throw if UpdatePostRepository throws', async () => {
    const { sut, updatePostRepositoryStub } = makeSut()
    jest.spyOn(updatePostRepositoryStub, 'updatePost').mockReturnValueOnce(Promise.reject(new Error()))
    const params = mockParams()
    const promise = sut.update(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const result = await sut.update(mockParams())
    expect(result).toEqual(true)
  })
})
