import MockDate from 'mockdate'

import { LoadCarByIdRepository } from '@/data/protocols'
import { DbLoadCarById } from './load-car-by-id'
import { mockLoadCarByIdRepository, mockCarsModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbLoadCarById
  loadCarByIdRepositoryStub: LoadCarByIdRepository
}

const makeSut = (): SutTypes => {
  const loadCarByIdRepositoryStub = mockLoadCarByIdRepository()
  const sut = new DbLoadCarById(loadCarByIdRepositoryStub)
  return {
    sut,
    loadCarByIdRepositoryStub
  }
}

describe('DbLoadCarById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })
  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurvetByIdRepository with correct values', async () => {
    const { sut, loadCarByIdRepositoryStub } = makeSut()
    const loadById = jest.spyOn(loadCarByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadById).toHaveBeenCalledWith('any_id')
  })

  test('Should return an car on LoadSurvetByIdRepository success', async () => {
    const { sut } = makeSut()
    const car = await sut.loadById('any_id')
    expect(car).toEqual(mockCarsModel()[0])
  })

  test('Should return null if LoadSurvetByIdRepository returns null', async () => {
    const { sut, loadCarByIdRepositoryStub } = makeSut()
    jest.spyOn(loadCarByIdRepositoryStub, 'loadById').mockReturnValueOnce(null)
    const car = await sut.loadById('any_id')
    expect(car).toBeNull()
  })

  test('Should throw if LoadSurvetByIdRepository throws', async () => {
    const { sut, loadCarByIdRepositoryStub } = makeSut()
    jest.spyOn(loadCarByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
