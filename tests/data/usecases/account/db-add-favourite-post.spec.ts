import { AddFavouritePost } from '@/domain/usecases'
import { AddFavouritePostRepository } from '@/data/protocols'
import { DbAddFavouritePost } from '@/data/usecases'

import { mockAddFavouritePostRepository } from '@tests/data/mocks'

type SutTypes = {
  sut: DbAddFavouritePost
  addFavouritePostStub: AddFavouritePostRepository
}

const mockParams = (): AddFavouritePost.Params => ({
  id: 'any_id',
  favouritePostId: 'any_favourite_post_id'
})

const makeSut = (): SutTypes => {
  const addFavouritePostStub = mockAddFavouritePostRepository()
  const sut = new DbAddFavouritePost(addFavouritePostStub)
  return {
    sut,
    addFavouritePostStub
  }
}

describe('DbAddFavouritePost Usecase', () => {
  test('Should call AddFavouritePostRepository with correct values', async () => {
    const { sut, addFavouritePostStub } = makeSut()
    const addSpy = jest.spyOn(addFavouritePostStub, 'addFavourite')
    const params = mockParams()
    await sut.add(params)
    expect(addSpy).toHaveBeenCalledWith(params)
  })

  test('Should DbAddFavouritePost throw if AddFavouritePostRepository throws', async () => {
    const { sut, addFavouritePostStub } = makeSut()
    jest.spyOn(addFavouritePostStub, 'addFavourite').mockReturnValueOnce(Promise.reject(new Error()))
    const params = mockParams()
    const promise = sut.add(params)
    await expect(promise).rejects.toThrow()
  })

  test('Should return false if AddFavouritePostRepository return false', async () => {
    const { sut, addFavouritePostStub } = makeSut()
    jest.spyOn(addFavouritePostStub, 'addFavourite').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.add(mockParams())
    expect(result).toEqual({ ok: false })
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(mockParams())
    expect(result).toEqual({ ok: true })
  })
})
