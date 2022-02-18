import MockDate from 'mockdate'

import { LoadProfiles } from '@/domain/usecases'
import { LoadProfilesController } from '@/presentation/controllers'
import { noContent, serverError, serverSuccess } from '@/presentation/helpers/http/http-helper'

import { mockProfileModels, throwError } from '@tests/domain/mocks'
import { mockLoadProfiles } from '@tests/presentation/mocks'

type SutTypes = {
  sut: LoadProfilesController
  loadProfilesStub: LoadProfiles
}

const makeSut = (): SutTypes => {
  const loadProfilesStub = mockLoadProfiles()
  const sut = new LoadProfilesController(loadProfilesStub)
  return {
    sut,
    loadProfilesStub
  }
}

describe('LoadProfile Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call LoadProfiles', async () => {
    const { sut, loadProfilesStub } = makeSut()
    const loadProfilesSpy = jest.spyOn(loadProfilesStub, 'load')
    await sut.handle({})
    expect(loadProfilesSpy).toHaveBeenCalled()
  })

  test('Should 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverSuccess(mockProfileModels()))
  })

  test('Should 204 LoadProfiles returns empty', async () => {
    const { sut, loadProfilesStub } = makeSut()
    jest.spyOn(loadProfilesStub, 'load').mockReturnValueOnce(Promise.resolve([]))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadProfiles throws', async () => {
    const { sut, loadProfilesStub } = makeSut()
    jest.spyOn(loadProfilesStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
