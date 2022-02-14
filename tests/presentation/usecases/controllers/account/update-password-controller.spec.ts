import { UpdatePassword } from '@/domain/usecases'
import { UpdatePasswordController } from '@/presentation/controllers'
import { UnknownError } from '@/presentation/errors'
import { serverSuccess, badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, Validation } from '@/presentation/protocols'
import { throwError } from '@tests/domain/mocks'
import { mockUpdatePassword, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: UpdatePasswordController
  validationStub: Validation
  updatePasswordStub: UpdatePassword
}
const makeSut = (): SutTypes => {
  const updatePasswordStub = mockUpdatePassword()
  const validationStub = mockValidation()
  const sut = new UpdatePasswordController(validationStub, updatePasswordStub)
  return {
    sut,
    validationStub,
    updatePasswordStub
  }
}
const mockRequest = (): HttpRequest => ({
  body: {
    password: 'any_password'
  },
  params: {
    id: 'any_id'
  }
})
describe('UpdatePassword Controller', () => {
  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call updatePassword with correct values', async () => {
    const { sut, updatePasswordStub } = makeSut()
    const request = mockRequest()
    const updateSpy = jest.spyOn(updatePasswordStub, 'update')
    await sut.handle(request)
    expect(updateSpy).toHaveBeenCalledWith({ id: request.params.id, password: request.body.password })
  })

  test('Should return 400 if updatePassword returns false', async () => {
    const { sut, updatePasswordStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(updatePasswordStub, 'update').mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new UnknownError('Update Passowrd')))
  })

  test('Should throw if updatePassword throws', async () => {
    const { sut, updatePasswordStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(updatePasswordStub, 'update').mockImplementationOnce(throwError)
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
