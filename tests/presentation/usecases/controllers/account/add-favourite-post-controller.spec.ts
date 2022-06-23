import { AddFavouritePost } from '@/domain/usecases'
import { AddFavouritePostController } from '@/presentation/controllers'
import { serverSuccess, badRequest, serverError } from '@/presentation/helpers'
import { Validation } from '@/presentation/protocols'
import { throwError } from '@tests/domain/mocks'
import { mockAddFavouritePost, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: AddFavouritePostController
  validationStub: Validation
  addFavouritePostStub: AddFavouritePost
}
const makeSut = (): SutTypes => {
  const addFavouritePostStub = mockAddFavouritePost()
  const validationStub = mockValidation()
  const sut = new AddFavouritePostController(validationStub, addFavouritePostStub)
  return {
    sut,
    validationStub,
    addFavouritePostStub
  }
}
const mockRequest = (): AddFavouritePostController.Request => ({
  accountId: 'any_id',
  favouritePostId: 'any_favourite_post_id'
})
describe('AddFavouritePost Controller', () => {
  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call addFavouritePost with correct values', async () => {
    const { sut, addFavouritePostStub } = makeSut()
    const request = mockRequest()
    const addSpy = jest.spyOn(addFavouritePostStub, 'add')
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({ id: request.accountId, favouritePostId: request.favouritePostId })
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, addFavouritePostStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(addFavouritePostStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })
})
