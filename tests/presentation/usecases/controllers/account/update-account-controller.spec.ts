import { UpdateAccount } from '@/domain/usecases'
import { UpdateAccountController } from '@/presentation/controllers'
import { serverSuccess, badRequest, serverError } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols'
import { throwError } from '@tests/domain/mocks'
import { mockUpdateAccount, mockValidation } from '@tests/presentation/mocks'

type SutTypes = {
  sut: UpdateAccountController
  validationStub: Validation
  updateAccountStub: UpdateAccount
}
const makeSut = (): SutTypes => {
  const updateAccountStub = mockUpdateAccount()
  const validationStub = mockValidation()
  const sut = new UpdateAccountController(validationStub, updateAccountStub)
  return {
    sut,
    validationStub,
    updateAccountStub
  }
}
const mockRequest = (): UpdateAccountController.Request => ({
  id: 'any_id',
  fields: {
    field: 'new_value'
  }
})
describe('UpdateAccount Controller', () => {
  test('Should return 400 if Validation returns an error ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call updateAccount with correct values', async () => {
    const { sut, updateAccountStub } = makeSut()
    const request = mockRequest()
    const updateSpy = jest.spyOn(updateAccountStub, 'update')
    await sut.handle(request)
    expect(updateSpy).toHaveBeenCalledWith(request)
  })

  test('Should call updateAccount with correct values', async () => {
    const { sut, updateAccountStub } = makeSut()
    const request = mockRequest()
    jest.spyOn(updateAccountStub, 'update').mockImplementationOnce(throwError)
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
