import { UpdatePost } from '@/domain/usecases'
import { UpdatePostController } from '@/presentation/controllers'
import { serverSuccess, badRequest, serverError } from '@/presentation/helpers'
import { Validation } from '@/presentation/protocols'
import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockUpdatePost, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: UpdatePostController
  validationStub: Validation
  updatePostStub: UpdatePost
}
const makeSut = (): SutTypes => {
  const updatePostStub = mockUpdatePost()
  const validationStub = mockValidation()
  const sut = new UpdatePostController(validationStub, updatePostStub)
  return {
    sut,
    validationStub,
    updatePostStub
  }
}
const mockRequest = (): UpdatePostController.Request => {
  const { createdAt, modifiedAt, ...params } = mockPostsModel()[0]
  return { ...params, accountId: 'any_account_id' }
}
describe('UpdatePost Controller', () => {
  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call updatePost with correct values', async () => {
    const { sut, updatePostStub } = makeSut()
    const request = mockRequest()
    const updateSpy = jest.spyOn(updatePostStub, 'update')
    await sut.handle(request)
    const { accountId, ...updateParams } = request
    expect(updateSpy).toHaveBeenCalledWith({ id: accountId, fields: updateParams })
  })

  test('Should call updatePost with correct values', async () => {
    const { sut, updatePostStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(updatePostStub, 'update').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverSuccess({ ok: true }))
  })
})
