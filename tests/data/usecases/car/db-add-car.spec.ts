import MockDate from 'mockdate'

import { DbAddCar } from '@/data/usecases'
import { mockAddCarRepository, throwError } from '@/domain/test'
import { mockCarsParams } from '@tests/domain/mocks'

const makeSut = (): any => {
  const addCarRepositoryStub = mockAddCarRepository()
  const sut = new DbAddCar(addCarRepositoryStub)
  return {
    sut,
    addCarRepositoryStub
  }
}

describe('DbAddCar UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // congela a data com base no valor inserido
  })

  afterAll(() => {
    MockDate.reset() // congela a data com base no valor inserido
  })

  test('Should call AddCarRepository with correct values', async () => {
    const { sut, addCarRepositoryStub } = makeSut()
    const carData = mockCarsParams()
    const addSpy = jest.spyOn(addCarRepositoryStub, 'add')
    await sut.add(carData)
    expect(addSpy).toHaveBeenCalledWith(carData)
  })

  test('Should throw if AddCarRepository throws', async () => {
    const { sut, addCarRepositoryStub } = makeSut()
    const carData = mockCarsParams()
    jest.spyOn(addCarRepositoryStub, 'add').mockImplementationOnce(throwError)
    const promise = sut.add(carData)
    await expect(promise).rejects.toThrow()
  })
})
