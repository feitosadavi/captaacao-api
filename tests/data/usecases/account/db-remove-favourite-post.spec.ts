import { RemoveFavouritePost } from '@/domain/usecases'
import { RemoveFavouritePostRepository } from '@/data/protocols'
import { DbRemoveFavouritePost } from '@/data/usecases'

import { mockRemoveFavouritePostRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbRemoveFavouritePost
  removeFavouritePostStub: RemoveFavouritePostRepository
}

const mockParams = (): RemoveFavouritePost.Params => ({
  id: 'any_id',
  favouritePostId: 'any_favourite_post_id'
})

const makeSut = (): SutTypes => {
  const removeFavouritePostStub = mockRemoveFavouritePostRepository()
  const sut = new DbRemoveFavouritePost(removeFavouritePostStub)
  return {
    sut,
    removeFavouritePostStub
  }
}

describe('DbRemoveFavouritePost Usecase', () => {
  test('Should call RemoveFavouritePostRepository with correct values', async () => {
    const { sut, removeFavouritePostStub } = makeSut()
    const addSpy = jest.spyOn(removeFavouritePostStub, 'removeFavourite')
    const params = mockParams()
    await sut.remove(params)
    expect(addSpy).toHaveBeenCalledWith(params)
  })

  test('Should DbRemoveFavouritePost throw if RemoveFavouritePostRepository throws', async () => {
    const { sut, removeFavouritePostStub } = makeSut()
    jest.spyOn(removeFavouritePostStub, 'removeFavourite').mockReturnValueOnce(Promise.reject(new Error()))
    const params = mockParams()
    const promise = sut.remove(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should return false if RemoveFavouritePostRepository return false', async () => {
    const { sut, removeFavouritePostStub } = makeSut()
    jest.spyOn(removeFavouritePostStub, 'removeFavourite').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.remove(mockParams())
    expect(result).toEqual({ ok: false })
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const result = await sut.remove(mockParams())
    expect(result).toEqual({ ok: true })
  })
})
