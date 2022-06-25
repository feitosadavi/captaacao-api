import { RemoveFavouritePost } from '@/domain/usecases'
import { RemoveFavouritePostController } from '@/presentation/controllers'
import { serverSuccess, badRequest, serverError } from '@/presentation/helpers'
import { Validation } from '@/presentation/protocols'
import { throwError } from '@tests/domain/mocks'
import { mockRemoveFavouritePost, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: RemoveFavouritePostController
  validationStub: Validation
  removeFavouritePostStub: RemoveFavouritePost
}
const makeSut = (): SutTypes => {
  const removeFavouritePostStub = mockRemoveFavouritePost()
  const validationStub = mockValidation()
  const sut = new RemoveFavouritePostController(validationStub, removeFavouritePostStub)
  return {
    sut,
    validationStub,
    removeFavouritePostStub
  }
}
const mockRequest = (): RemoveFavouritePostController.Request => ({
  accountId: 'any_id',
  favouritePostId: 'any_favourite_post_id'
})
describe('RemoveFavouritePost Controller', () => {
  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call removeFavouritePost with correct values', async () => {
    const { sut, removeFavouritePostStub } = makeSut()
    const request = mockRequest()
    const removeSpy = jest.spyOn(removeFavouritePostStub, 'remove')
    await sut.handle(request)
    expect(removeSpy).toHaveBeenCalledWith({ id: request.accountId, favouritePostId: request.favouritePostId })
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, removeFavouritePostStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(removeFavouritePostStub, 'remove').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })
})
