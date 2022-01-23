import MockDate from 'mockdate'

import { DbLoadCars } from '@/data/usecases'
import { LoadCarsRepository } from '@/data/protocols'

import { mockLoadCarsRepository, throwError } from '@/domain/test'
import { mockCarsModel } from '@tests/domain/mocks'

type SutTypes = {
  sut: DbLoadCars
  loadCarsRepositoryStub: LoadCarsRepository
}

const makeSut = (): SutTypes => {
  const loadCarsRepositoryStub = mockLoadCarsRepository()
  const sut = new DbLoadCars(loadCarsRepositoryStub)
  return {
    sut,
    loadCarsRepositoryStub
  }
}

describe('DbLoadCars UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadCarsRepository', async () => {
    const { sut, loadCarsRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadCarsRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return cars on LoadCarsRepository success', async () => {
    const { sut } = makeSut()
    const cars = await sut.load()
    expect(cars).toEqual(mockCarsModel())
  })

  test('Should throw if LoadCarsRepository throws', async () => {
    const { sut, loadCarsRepositoryStub } = makeSut()
    jest.spyOn(loadCarsRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
