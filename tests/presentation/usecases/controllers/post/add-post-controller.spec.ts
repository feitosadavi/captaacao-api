import MockDate from 'mockdate'

import { AddPost } from '@/domain/usecases'
import { Validation } from '@/presentation/protocols'
import { AddPostController } from '@/presentation/controllers'
import { badRequest, serverError, noContent } from '@/presentation/helpers'

import { mockPostsParams, throwError } from '@tests/domain/mocks'
import { mockAddPost, mockValidation } from '@tests/presentation/mocks'

const mockRequest = (): AddPostController.Request => {
  const { status, views, createdAt, modifiedAt, ...request } = mockPostsParams()[0]
  return { ...request, accountId: 'any_account_id' }
}

type SutTypes = {
  sut: AddPostController
  validationStub: Validation
  addPostStub: AddPost
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addPostStub = mockAddPost()
  const sut = new AddPostController(validationStub, addPostStub)
  return {
    sut,
    validationStub,
    addPostStub
  }
}
describe('AddPost Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddPost with correct values', async () => {
    const { sut, addPostStub } = makeSut()
    const addSpy = jest.spyOn(addPostStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith(mockPostsParams()[0])
  })

  test('Should return 500 if AddPost throws', async () => {
    const { sut, addPostStub } = makeSut()
    jest.spyOn(addPostStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
