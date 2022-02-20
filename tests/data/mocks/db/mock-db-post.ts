import {
  AddCarRepository,
  LoadCarByIdRepository,
  LoadCarsRepository
} from '@/data/protocols'
import { CarModel } from '@/domain/models'
import { AddCarParams } from '@/domain/usecases'
import { mockCarsModel } from '@tests/domain/mocks'

export const mockAddCarRepository = (): AddCarRepository => {
  class AddCarRepositoryStub implements AddCarRepository {
    async add (data: AddCarParams): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddCarRepositoryStub()
}

export const mockLoadCarsRepository = (): LoadCarsRepository => {
  class LoadCarsRepositoryStub implements LoadCarsRepository {
    async loadAll (): Promise<CarModel[]> {
      return Promise.resolve(mockCarsModel())
    }
  }
  return new LoadCarsRepositoryStub()
}

export const mockLoadCarByIdRepository = (): LoadCarByIdRepository => {
  class LoadCarByIdRepositoryStub implements LoadCarByIdRepository {
    async loadById (id: string): Promise<CarModel> {
      return Promise.resolve(mockCarsModel()[0])
    }
  }
  return new LoadCarByIdRepositoryStub()
}
