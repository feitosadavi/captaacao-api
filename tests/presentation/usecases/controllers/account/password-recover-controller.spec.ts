import { LoadAccountById } from '@/domain/usecases/account/load-account-by-id'
import { PasswordRecoverController } from '@/presentation/controllers/account/password-recover-controller'
import { HttpRequest } from '@/presentation/protocols'

import { mockLoadAccountById } from '@tests/presentation/mocks'

type SutTypes = {
  sut: PasswordRecoverController
  LoadAccountByIdStub: LoadAccountById
}

const mockRequest = (): HttpRequest => (
  {
    params: {
      id: 'any_id'
    }
  }
)

const makeSut = (): SutTypes => {
  const LoadAccountByIdStub = mockLoadAccountById()
  const sut = new PasswordRecoverController(LoadAccountByIdStub)
  return {
    sut,
    LoadAccountByIdStub
  }
}

describe('PasswordRecover Controller', () => {
  test('Should call LoadAccountById with correct id', async () => {
    const { sut, LoadAccountByIdStub } = makeSut()
    const loadAccountByIdSpy = jest.spyOn(LoadAccountByIdStub, 'loadById')
    await sut.handle(mockRequest())
    expect(loadAccountByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
