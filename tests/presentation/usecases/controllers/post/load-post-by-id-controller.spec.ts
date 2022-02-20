import MockDate from 'mockdate'

import { LoadPostById } from '@/domain/usecases'
import { LoadPostByIdController } from '@/presentation/controllers'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { HttpRequest } from '@/presentation/protocols'

import { mockPostsModel, throwError } from '@tests/domain/mocks'
import { mockLoadPostById } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadPostByIdController
  LoadPostByIdStub: LoadPostById
}

const mockRequest = (): HttpRequest => (
  {
    params: {
      id: 'any_id'
    }
  }
)

const makeSut = (): SutTypes => {
  const LoadPostByIdStub = mockLoadPostById()
  const sut = new LoadPostByIdController(LoadPostByIdStub)
  return {
    sut,
    LoadPostByIdStub
  }
}

describe('LoadPost Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadPostById with correct id', async () => {
    const { sut, LoadPostByIdStub } = makeSut()
    const loadPostByIdSpy = jest.spyOn(LoadPostByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadPostByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())// ATENÇÃO
    expect(httpResponse).toEqual(serverSuccess(mockPostsModel()[0]))
  })

  test('Should 204 LoadPostById returns empty', async () => {
    const { sut, LoadPostByIdStub } = makeSut()
    jest.spyOn(LoadPostByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadPostById throws', async () => {
    const { sut, LoadPostByIdStub } = makeSut()
    jest.spyOn(LoadPostByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
