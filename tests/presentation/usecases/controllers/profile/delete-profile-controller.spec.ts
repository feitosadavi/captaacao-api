import { DeleteProfile } from '@/domain/usecases'
import { serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'
import { DeleteProfileController } from '@/presentation/controllers'

import { mockDeleteProfile } from '@tests/presentation/mocks'
import { HttpRequest } from '@/presentation/protocols'

type SutTypes = {
  sut: DeleteProfileController
  deleteProfileStub: DeleteProfile
}

const makeSut = (): SutTypes => {
  const deleteProfileStub = mockDeleteProfile()
  const sut = new DeleteProfileController(deleteProfileStub)
  return {
    sut,
    deleteProfileStub
  }
}

const mockRequest = (): HttpRequest<any, any, {id: string}> => ({
  params: { id: 'any_id' },
  headers: {
    'x-access-token': 'any_access_token'
  }
})

describe('DeleteProfileController', () => {
  test('Should call deleteProfile with correct params', async () => {
    const { sut, deleteProfileStub } = makeSut()
    const deleteProfileStubSpy = jest.spyOn(deleteProfileStub, 'delete')
    await sut.handle(mockRequest())
    expect(deleteProfileStubSpy).toHaveBeenCalledWith({ id: 'any_id' })
  })

  test('Should return 500 if deleteProfile throws', async () => {
    const { sut, deleteProfileStub } = makeSut()
    const deleteProfileStubSpy = jest.spyOn(deleteProfileStub, 'delete')
    deleteProfileStubSpy.mockReturnValueOnce(Promise.reject(new Error()))
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverSuccess(true))
  })
})
